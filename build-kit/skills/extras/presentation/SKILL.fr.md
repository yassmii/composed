---
name: presentation
description: >
  Crée des présentations professionnelles exportables en PPTX via un fichier HTML unique utilisant la librairie dom-to-pptx.
  Utilise ce skill dès que l'utilisateur demande une présentation, des slides, un deck ou un PowerPoint — même s'il ne mentionne pas explicitement HTML ou dom-to-pptx.
  Le fichier généré s'ouvre dans le navigateur et contient un bouton "Exporter en PPTX" intégré.
license: MIT
metadata:
  author: composed-build-kit
  version: "1.0.0"
---

# Skill : Présentation (HTML → PPTX)

## Principe

On génère un **fichier HTML unique** contenant :
- Toutes les slides (div `.slide`) avec leur CSS intégré
- La librairie `dom-to-pptx` en CDN
- Un bouton export qui lance `exportToPptx()` sur toutes les `.slide`

L'utilisateur ouvre le HTML dans Chrome, clique "Exporter", et récupère un `.pptx` propre.

---

## Architecture d'une slide

```html
<div class="slide" style="width:1280px;height:720px;display:grid;grid-template-rows:auto 1fr auto;padding:48px 56px">
  <div><!-- Row 1: Header --></div>
  <div class="content" style="display:grid;align-content:center;gap:24px"><!-- Row 2: Contenu --></div>
  <div class="ftr"><!-- Row 3: Footer --></div>
</div>
```

`grid-template-rows: auto 1fr auto` → header haut fixe, footer bas fixe, contenu centré verticalement.

---

## Grilles utilitaires (dans `.content`)

| Usage | Classe | CSS |
|-------|--------|-----|
| Métriques 3 col | `.m-grid.cols-3` | `grid-template-columns: repeat(3,1fr)` |
| Métriques 4 col | `.m-grid.cols-4` | `grid-template-columns: repeat(4,1fr)` |
| Cards 2 col | `.c-grid.cols-2` | `grid-template-columns: repeat(2,1fr)` |
| Cards 4 col | `.c-grid.cols-4` | `grid-template-columns: repeat(4,1fr)` |
| Timeline | `.tl-grid` | `grid-template-columns: repeat(5,1fr)` |
| Flow/Journey | `.flow-grid` | `grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr` |
| Split 2/1 | direct | `grid-template-columns: 2fr 1fr` |

---

## Règles de sizing (CRITIQUE — slides projetées)

| Élément | Taille |
|---------|--------|
| Titre `h2` | **38px+**, bold |
| Sous-titre | 18px |
| Body text | **16-18px minimum** (jamais < 14px) |
| Chiffres clés / métriques | **52px+**, bold |
| Labels sous métriques | 16px |
| Card padding | 28px+ |
| Card border-radius | 14-16px |
| Timeline circles | 60px |
| Font recommandée | Plus Jakarta Sans, Inter (Google Fonts) |

---

## Script d'export (toujours inclure en bas du HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/dom-to-pptx@latest/dist/dom-to-pptx.bundle.js"></script>
<script>
async function exportPptx() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  await domToPptx.exportToPptx(slides, { fileName: 'Presentation.pptx' });
}
</script>

<!-- Bouton flottant -->
<button onclick="exportPptx()" style="
  position:fixed; bottom:32px; right:32px; z-index:9999;
  padding:14px 28px; border-radius:999px; border:none; cursor:pointer;
  background:linear-gradient(135deg,#397ef6,#00c58e);
  color:#fff; font-size:15px; font-weight:700;
  box-shadow: 0 4px 20px rgba(57,126,246,.4);
">⬇ Exporter en PPTX</button>
```

---

## ⚠️ Pièges critiques pour l'export PPTX

### À NE PAS FAIRE
- ❌ `autoEmbedFonts: true` dans les options → glyphes corrompus (ÂĈDĆĦ au lieu du vrai texte)
- ❌ `!important` dans le CSS → ignoré par dom-to-pptx
- ❌ `linear-gradient` sur petits éléments (badges, pills, boutons inline) → rendu cassé dans PowerPoint
- ❌ `box-shadow` complexes → mal supportés, simplifier ou supprimer
- ❌ Pseudo-éléments CSS (`:before`, `:after`) → non exportés

### À FAIRE
- ✅ Couleurs **solides** (`background: #00c58e`) sur tous les petits éléments
- ✅ Gradients OK sur **grands éléments** : fonds de slide, grandes barres de progression
- ✅ `grid-template-columns` avec fractions (`45fr 25fr 20fr 10fr`) pour barres proportionnelles
- ✅ Inline styles sur les éléments critiques pour garantir la fidélité
- ✅ Tester l'export avant de livrer

---

## Design : alterner slides claires et sombres

**Slide claire** : `background: #f9f9f9`, texte `#0e2c45`
**Slide sombre** : `background: #0e2c45`, texte `#ffffff`

Recommandation : slide titre → sombre, slides contenu → claires, slide conclusion → sombre.

### Palette par défaut (Capsule AI — adaptable)
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

### Composants courants

**Badge / pill** (toujours couleur solide) :
```html
<span style="background:#d2f4ea;color:#029e73;padding:5px 14px;border-radius:999px;font-size:13px;font-weight:700;">Label</span>
```

**Carte contenu** :
```html
<div style="background:#fff;border:1px solid #e8edf2;border-radius:16px;padding:28px;">...</div>
```

**Métrique** :
```html
<div style="text-align:center;">
  <div style="font-size:56px;font-weight:800;color:#0e2c45;">84%</div>
  <div style="font-size:16px;color:#6b7280;margin-top:8px;">Taux de satisfaction</div>
</div>
```

**Ligne bon/mauvais** :
```html
<div style="background:#d2f4ea;color:#029e73;padding:10px 16px;border-radius:8px;font-size:16px;font-weight:600;">✓ Bonne pratique</div>
<div style="background:#ffe2e2;color:#ff5c5c;padding:10px 16px;border-radius:8px;font-size:16px;font-weight:600;">✕ À éviter</div>
```

---

## Structure HTML complète type

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 40px; background: #dde1e7; display: flex; flex-direction: column; align-items: center; gap: 32px; font-family: 'Plus Jakarta Sans', sans-serif; }
    .slide { width: 1280px; height: 720px; display: grid; grid-template-rows: auto 1fr auto; padding: 48px 56px; border-radius: 0; overflow: hidden; }
    /* ... CSS global ... */
  </style>
</head>
<body>

  <!-- SLIDE 1 : Titre (sombre) -->
  <div class="slide" style="background:#0e2c45;color:#fff;">
    <div>
      <span style="background:#00c58e;color:#fff;padding:5px 14px;border-radius:999px;font-size:13px;font-weight:700;">Sous-titre</span>
    </div>
    <div style="display:grid;align-content:center;">
      <h2 style="font-size:56px;font-weight:800;margin:0 0 16px;">Titre Principal</h2>
      <p style="font-size:18px;color:#a0b8cc;margin:0;">Description concise</p>
    </div>
    <div style="font-size:14px;color:#6b7280;">Auteur · Date</div>
  </div>

  <!-- SLIDE 2 : Contenu (claire) -->
  <div class="slide" style="background:#f9f9f9;color:#0e2c45;">
    <div>
      <h2 style="font-size:38px;font-weight:800;margin:0;">Titre de la slide</h2>
      <p style="font-size:18px;color:#6b7280;margin:8px 0 0;">Sous-titre optionnel</p>
    </div>
    <div class="content" style="display:grid;align-content:center;gap:24px;">
      <!-- Contenu ici -->
    </div>
    <div class="ftr" style="font-size:14px;color:#6b7280;">Footer</div>
  </div>

  <!-- Script export -->
  <script src="https://cdn.jsdelivr.net/npm/dom-to-pptx@latest/dist/dom-to-pptx.bundle.js"></script>
  <script>
  async function exportPptx() {
    const slides = Array.from(document.querySelectorAll('.slide'));
    await domToPptx.exportToPptx(slides, { fileName: 'Presentation.pptx' });
  }
  </script>
  <button onclick="exportPptx()" style="position:fixed;bottom:32px;right:32px;z-index:9999;padding:14px 28px;border-radius:999px;border:none;cursor:pointer;background:#00c58e;color:#fff;font-size:15px;font-weight:700;">⬇ Exporter en PPTX</button>

</body>
</html>
```

---

## Workflow de génération

1. **Analyser le sujet** — identifier le nombre de slides nécessaires, les types de contenu (métriques, timeline, comparaison, liste...)
2. **Planifier l'alternance** claire/sombre
3. **Générer le HTML complet** en respectant les règles de sizing et les pièges d'export
4. **Toujours inclure** le script dom-to-pptx et le bouton export
5. **Livrer** le fichier `.html` à télécharger et ouvrir dans Chrome
