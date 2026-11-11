# Submodule Mode (Optional)

For teams that prefer the kit to **propagate updates automatically** rather than running `composed-kit update` manually, you can install the kit as a git submodule.

## When to use this

- Multiple developers on a single project
- You want everyone to receive kit updates by simply `git pull --recurse-submodules`
- You're OK with the overhead of submodules

## When NOT to use this

- Solo projects
- Teams unfamiliar with git submodules
- You want surgical control over which kit versions you run

## Setup

```bash
cd your-project
git submodule add git@github.com:yassmii/composed.git .composed
git submodule update --init --recursive
```

## Initial install

```bash
node .composed/build-kit/bin/composed-kit.mjs init \
  --kit-root=.composed/build-kit \
  --cwd=.
```

Submodule users get the same `--lang` flag as direct source users:

```bash
node .composed/build-kit/bin/composed-kit.mjs init \
  --kit-root=.composed/build-kit \
  --cwd=. \
  --yes \
  --lang=en \
  --agents=claude-code,codex \
  --skills=core,support
```

## Update

```bash
cd .composed && git pull origin main && cd ..
node .composed/build-kit/bin/composed-kit.mjs update --kit-root=.composed/build-kit --cwd=.
git add .composed AGENTS.md CLAUDE.md skills/
git commit -m "chore: update composed-build-kit"
```

## Team onboarding

Teammates need to remember to clone with submodules:

```bash
git clone --recurse-submodules <repo-url>
# or, after a regular clone:
git submodule update --init --recursive
```

This is the main friction of the submodule approach.
