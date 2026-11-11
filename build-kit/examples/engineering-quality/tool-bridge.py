"""Original Composed fixture adapter; uses the pinned engines without copying their source."""

import hashlib
import importlib
import importlib.metadata
import json
import pathlib
import platform
import runpy
import subprocess
import sys

PINS = {
    "crapper": "6fd92c4c9bcc56efb64a2f8743d5a2993bcfd42d",
    "dryer": "66ff6d21a42c04afcad89c78a80066176d1294b0",
    "mutator": "a5a0cb803b66e0cdb8bf471b3b08af701d424a41",
}


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def checked_root(raw):
    root = pathlib.Path(raw)
    if not root.is_absolute() or not root.is_dir():
        raise ValueError("--tools-root must be an existing absolute directory")
    root = root.resolve()
    for name, expected in PINS.items():
        directory = root / name
        actual = subprocess.check_output(
            ["git", "-C", str(directory), "rev-parse", "HEAD"], text=True
        ).strip()
        dirty = subprocess.check_output(
            ["git", "-C", str(directory), "status", "--porcelain", "--untracked-files=no"],
            text=True,
        ).strip()
        if actual != expected or dirty:
            raise ValueError(f"{name}: require the clean pinned checkout {expected}")
    return root


def prepare_modules(root):
    # Import only after checking the requested source revisions. Prepared interpreters still
    # execute their installed modules/.pth files: this is not a Python sandbox or attestation.
    for name in PINS:
        module = importlib.import_module(name)
        expected = (root / name / "src" / name / "__init__.py").resolve()
        if pathlib.Path(module.__file__).resolve() != expected:
            raise ValueError(f"{name}: interpreter imports a different source root")
    pack = importlib.import_module("tree_sitter_language_pack")
    pack.configure(pack.PackConfig(cache_dir=str(root / "cache")))
    if not {"javascript", "typescript"}.issubset(pack.downloaded_languages()):
        raise ValueError("Prepare the javascript/typescript grammar cache explicitly before running")
    return pack


def inspection(root, pack):
    sources = {}
    for name, revision in PINS.items():
        directory = root / name
        tracked = subprocess.check_output(
            ["git", "-C", str(directory), "ls-files", "-z"], text=True
        ).split("\0")
        sources[name] = {
            "revision": revision,
            "path": str(directory),
            "tracked_sha256": {path: digest(directory / path) for path in tracked if path},
        }
    cache = pathlib.Path(pack.cache_dir())
    libraries = sorted(path for path in cache.iterdir() if path.is_file())
    return {
        "scope": "prepared-external-quality-tools",
        "python": {"version": platform.python_version(), "executable": sys.executable},
        "platform": platform.platform(),
        "sources": sources,
        "distributions": {
            dist.metadata["Name"]: {
                "version": dist.version,
                "license_expression": dist.metadata.get("License-Expression"),
                "license": dist.metadata.get("License"),
                "license_files": dist.metadata.get_all("License-File", []),
            }
            for dist in importlib.metadata.distributions()
            if dist.metadata.get("Name")
        },
        "grammar_cache": {
            "directory": str(cache),
            "files": {path.name: digest(path) for path in libraries},
        },
        "limitations": [
            "Inspected local source/dependency declarations, not authenticated executables.",
            "A prepared grammar cache is required; upstream code is not network-sandboxed.",
        ],
    }


def facts(root, case):
    # Reuse the pinned engine's reader only for this fixture; retain the original EDN files.
    from mutator.edn import loads

    case = pathlib.Path(case)
    crap = loads((case / ".metrics/crap.edn").read_text())
    dry = loads((case / ".metrics/dry.edn").read_text())
    mutation = loads((case / ".metrics/mutate/access.edn").read_text())
    outcomes = mutation["outcomes"]
    if len(outcomes) != 1:
        raise ValueError("Fixture mutation inventory changed; review the pinned scenario")
    expected = next(iter(outcomes))
    identity = json.loads(expected)
    if identity[:3] != ["src/access.mjs", "access", "defn/eligible"] or identity[-2:] != [">=", ">"]:
        raise ValueError("Fixture no longer measures the intended >= to > boundary mutation")
    return {
        "eligible": next(item for item in crap["entries"] if item["name"] == "eligible"),
        "duplicate_candidates": dry["candidates"],
        "mutation_forms": mutation["forms"],
        "boundary_mutant": {"id": expected, "status": outcomes[expected]},
        "elimination_attribution": "not_assessed_by_engine_report",
    }


def main():
    if len(sys.argv) < 3:
        raise ValueError("Usage: tool-bridge.py inspect|facts|run TOOLS_ROOT [arguments]")
    action, raw_root, *args = sys.argv[1:]
    root = checked_root(raw_root)
    pack = prepare_modules(root)
    if action == "inspect" and not args:
        print(json.dumps(inspection(root, pack), sort_keys=True))
    elif action == "facts" and len(args) == 1:
        print(json.dumps(facts(root, args[0]), sort_keys=True))
    elif action == "run" and args and args[0] in PINS:
        name, *argv = args
        sys.argv = [name, *argv]
        runpy.run_module(name, run_name="__main__")
    else:
        raise ValueError("Unknown fixture adapter invocation")


if __name__ == "__main__":
    main()
