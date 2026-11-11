---
name: presentation
description: >
  Creates professional presentations exportable to PPTX via a single HTML file using the dom-to-pptx library.
  Use this skill whenever the user asks for a presentation, slides, a deck, or a PowerPoint — even if they don't explicitly mention HTML or dom-to-pptx.
  The generated file opens in the browser and contains a built-in "Export to PPTX" button.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill: Presentation (HTML → PPTX)

## Principle

You generate a **single HTML file** containing:
- All slides (div `.slide`) with their inline CSS
- The `dom-to-pptx` library via CDN
- An export button that triggers `exportToPptx()` on all `.slide` elements

The user opens the HTML in Chrome, clicks "Export", and gets a clean `.pptx`.

---

## Slide architecture

```html
<div class="slide" style="width:1280px;height:720px;display:grid;grid-template-rows:auto 1fr auto;padding:48px 56px">
  <div><!-- Row 1: Header --></div>
  <div class="content" style="display:grid;align-content:center;gap:24px"><!-- Row 2: Content --></div>
  <div class="ftr"><!-- Row 3: Footer --></div>
</div>
```

`grid-template-rows: auto 1fr auto` → fixed top header, fixed bottom footer, vertically centered content.

---

## Utility grids (inside `.content`)

| Usage | Class | CSS |
|-------|-------|-----|
| Metrics 3 col | `.m-grid.cols-3` | `grid-template-columns: repeat(3,1fr)` |
| Metrics 4 col | `.m-grid.cols-4` | `grid-template-columns: repeat(4,1fr)` |
| Cards 2 col | `.c-grid.cols-2` | `grid-template-columns: repeat(2,1fr)` |
| Cards 4 col | `.c-grid.cols-4` | `grid-template-columns: repeat(4,1fr)` |
| Timeline | `.tl-grid` | `grid-template-columns: repeat(5,1fr)` |
| Flow/Journey | `.flow-grid` | `grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr` |
| Split 2/1 | direct | `grid-template-columns: 2fr 1fr` |

---

## Sizing rules (CRITICAL — projected slides)

| Element | Size |
|---------|------|
| Title `h2` | **38px+**, bold |
| Subtitle | 18px |
| Body text | **16-18px minimum** (never < 14px) |
| Key numbers / metrics | **52px+**, bold |
| Labels under metrics | 16px |
| Card padding | 28px+ |
| Card border-radius | 14-16px |
| Timeline circles | 60px |
| Recommended font | Plus Jakarta Sans, Inter (Google Fonts) |

---

## Export script (always include at the bottom of the HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/dom-to-pptx@latest/dist/dom-to-pptx.bundle.js"></script>
<script>
async function exportPptx() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  await domToPptx.exportToPptx(slides, { fileName: 'Presentation.pptx' });
}
</script>

<!-- Floating button -->
<button onclick="exportPptx()" style="
  position:fixed; bottom:32px; right:32px; z-index:9999;
  padding:14px 28px; border-radius:999px; border:none; cursor:pointer;
  background:linear-gradient(135deg,#397ef6,#00c58e);
  color:#fff; font-size:15px; font-weight:700;
  box-shadow: 0 4px 20px rgba(57,126,246,.4);
">⬇ Export to PPTX</button>
```

---

## Critical pitfalls for PPTX export

### DO NOT DO
- `autoEmbedFonts: true` in the options → corrupted glyphs (ÂĈDĆĦ instead of the real text)
- `!important` in the CSS → ignored by dom-to-pptx
- `linear-gradient` on small elements (badges, pills, inline buttons) → broken rendering in PowerPoint
- Complex `box-shadow` → poorly supported, simplify or remove
- CSS pseudo-elements (`:before`, `:after`) → not exported

### DO
- **Solid** colors (`background: #00c58e`) on all small elements
- Gradients OK on **large elements**: slide backgrounds, large progress bars
- `grid-template-columns` with fractions (`45fr 25fr 20fr 10fr`) for proportional bars
- Inline styles on critical elements to guarantee fidelity
- Test the export before delivering

---

## Design: alternate light and dark slides

**Light slide**: `background: #f9f9f9`, text `#0e2c45`
**Dark slide**: `background: #0e2c45`, text `#ffffff`

Recommendation: title slide → dark, content slides → light, conclusion slide → dark.

### Default palette (Capsule AI — customizable)
```css
--bg-dark:   #0e2c45;
--bg-light:  #f9f9f9;
--card:      #ffffff;
--text-pri:  #0e2c45;
--text-lt:   #6b7280;
--green:     #00c58e;
--green-bg:  #d2f4ea;
--green-tx:  #029e73;
--blue:      #397ef6;
--blue-bg:   #e0edff;
--red-bg:    #ffe2e2;
--red-tx:    #ff5c5c;
--border:    #e8edf2;
```

### Common components

**Badge / pill** (always solid color):
```html
<span style="background:#d2f4ea;color:#029e73;padding:5px 14px;border-radius:999px;font-size:13px;font-weight:700;">Label</span>
```

**Content card**:
```html
<div style="background:#fff;border:1px solid #e8edf2;border-radius:16px;padding:28px;">...</div>
```

**Metric**:
```html
<div style="text-align:center;">
  <div style="font-size:56px;font-weight:800;color:#0e2c45;">84%</div>
  <div style="font-size:16px;color:#6b7280;margin-top:8px;">Satisfaction rate</div>
</div>
```

**Good/bad line**:
```html
<div style="background:#d2f4ea;color:#029e73;padding:10px 16px;border-radius:8px;font-size:16px;font-weight:600;">✓ Good practice</div>
<div style="background:#ffe2e2;color:#ff5c5c;padding:10px 16px;border-radius:8px;font-size:16px;font-weight:600;">✕ To avoid</div>
```

---

## Typical full HTML structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 40px; background: #dde1e7; display: flex; flex-direction: column; align-items: center; gap: 32px; font-family: 'Plus Jakarta Sans', sans-serif; }
    .slide { width: 1280px; height: 720px; display: grid; grid-template-rows: auto 1fr auto; padding: 48px 56px; border-radius: 0; overflow: hidden; }
    /* ... global CSS ... */
  </style>
</head>
<body>

  <!-- SLIDE 1: Title (dark) -->
  <div class="slide" style="background:#0e2c45;color:#fff;">
    <div>
      <span style="background:#00c58e;color:#fff;padding:5px 14px;border-radius:999px;font-size:13px;font-weight:700;">Subtitle</span>
    </div>
    <div style="display:grid;align-content:center;">
      <h2 style="font-size:56px;font-weight:800;margin:0 0 16px;">Main Title</h2>
      <p style="font-size:18px;color:#a0b8cc;margin:0;">Concise description</p>
    </div>
    <div style="font-size:14px;color:#6b7280;">Author · Date</div>
  </div>

  <!-- SLIDE 2: Content (light) -->
  <div class="slide" style="background:#f9f9f9;color:#0e2c45;">
    <div>
      <h2 style="font-size:38px;font-weight:800;margin:0;">Slide title</h2>
      <p style="font-size:18px;color:#6b7280;margin:8px 0 0;">Optional subtitle</p>
    </div>
    <div class="content" style="display:grid;align-content:center;gap:24px;">
      <!-- Content here -->
    </div>
    <div class="ftr" style="font-size:14px;color:#6b7280;">Footer</div>
  </div>

  <!-- Export script -->
  <script src="https://cdn.jsdelivr.net/npm/dom-to-pptx@latest/dist/dom-to-pptx.bundle.js"></script>
  <script>
  async function exportPptx() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    await domToPptx.exportToPptx(slides, { fileName: 'Presentation.pptx' });
  }
  </script>
  <button onclick="exportPptx()" style="position:fixed;bottom:32px;right:32px;z-index:9999;padding:14px 28px;border-radius:999px;border:none;cursor:pointer;background:#00c58e;color:#fff;font-size:15px;font-weight:700;">⬇ Export to PPTX</button>

</body>
</html>
```

---

## Generation workflow

1. **Analyze the topic** — identify how many slides are needed, the content types (metrics, timeline, comparison, list...)
2. **Plan the light/dark alternation**
3. **Generate the full HTML** following the sizing rules and export pitfalls
4. **Always include** the dom-to-pptx script and the export button
5. **Deliver** the `.html` file for the user to download and open in Chrome
