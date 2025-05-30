# Assets Directory Guide

This README describes every asset required by **Match Monsters**, its expected format, and how the game engine loads it.  
Use it as a checklist when replacing the built-in placeholders with real art / audio.

---

## 1. Directory Layout

```
assets/
├── images/
│   ├── elements/      # Element tile icons (6 png files)
│   ├── monsters/      # Portraits for every monster (pngs)
│   ├── stages/        # Stage background images (jpg / png)
│   └── favicon.ico    # Browser tab icon
└── sounds/
    ├── fx/            # Short sound-effects (mp3 / ogg / wav)
    └── music/         # Background music track(s)
```

> **Tip:** keep names **lower-case**, use hyphens instead of spaces.

---

## 2. Required Asset List

| Category | File(s) | Format | Dimensions / Duration | Purpose |
|----------|---------|--------|-----------------------|---------|
| Element Tiles | `fire.png`, `water.png`, `earth.png`, `air.png`, `light.png`, `berry.png` | PNG (transparent) | **64 × 64 px** (square) | Drawn on every board tile |
| Monster Portraits | one png per monster, id-based e.g. `emberclaw.png` | PNG (transparent) | **256 × 256 px** recommended (will be down-scaled) | Shown in UI slots & info modal |
| Stage Backgrounds | `volcano.jpg`, `ocean.jpg`, `forest.jpg`, `mountain.jpg`, `temple.jpg` | JPG / PNG | **1920 × 1080 px** or larger | Used as CSS background during battle |
| Favicon | `favicon.ico` | ICO / PNG | 32 × 32 px | Browser tab icon |
| Sound FX | `match.mp3`, `swap.mp3`, `invalid.mp3`, `evolve.mp3`, `boost.mp3`, `attack.mp3`, `damage.mp3`, `victory.mp3`, `defeat.mp3` | MP3 (fallback OGG) | ≤ 1 s each | Audio feedback |
| Music | `bgm.mp3` | MP3 (loopable) | 90-180 s | Background music |

---

## 3. Placeholder Assets

During development the game auto-generates simple colored circles for element icons if the real PNGs are missing and silently skips audio.  
• **Element placeholders** are created at runtime (see `createPlaceholderAssets()` in `js/main.js`).  
• **Monster portraits / stages** fall back to a generic solid color.  

Replace these files at any time without touching code – the loader always tries to fetch from disk first.

---

## 4. Replacing Placeholders

1. **Prepare art** in the correct size & format. Higher resolutions are fine; the engine scales down.  
2. Ensure the file name **matches exactly** what is referenced in the code / monster data (case-sensitive).  
3. Drop the file into the appropriate sub-folder.  
4. Hard refresh (or clear cache) in the browser. No rebuild step is required.

---

## 5. Asset Loading Behaviour

* Implemented in **`js/main.js → loadAssets()`**.  
* A manifest array defines every file path and type.  
* Missing files **do not crash**; they increment `ASSETS.failed` and yield a console warning (debug mode).  
* After all attempts, the game starts if **≥ 50 % of assets** loaded successfully – giving you flexibility during early art creation.

---

## 6. Creating Custom Assets

| Type | Key Guidelines |
|------|----------------|
| **Element Tiles** | Keep shapes simple & readable at 50–60 px. Add subtle bevel/shadow for depth. Transparent PNGs recommended. |
| **Monster Portraits** | Center the creature, leave margin so it isn’t cut by round-rect mask. Transparent background preferred. |
| **Stages** | Use soft-blurred artwork (parallax ready). Keep important detail away from center to avoid board overlap. |
| **Sound FX** | Export mono 44 kHz MP3. Normalize to -3 dB. 0.2–0.6 s length works best. |
| **Music** | Loop cleanly at start/end or provide an intro + seamless loop section. Target -14 LUFS loudness. |

---

## 7. Adding New Monsters / Elements

1. Add the new **portrait** image in `assets/images/monsters/`.  
2. Update `MONSTERS` array inside `js/constants.js` with `portrait` path.  
3. If adding a brand-new element, also add a tile icon in `assets/images/elements/` and extend `ELEMENT_TYPES` + color variables in `css/styles.css`.

---

## 8. Attribution & Licensing

* Place third-party assets **only** if you have the right to redistribute them.  
* Add credit lines inside this document or a separate `ATTRIBUTION.md`.  
* Respect the project’s MIT license – your assets can use a different license, just document it.

---

### Happy spriting, painting & composing!  
Drop in your art and audio, reload, and watch Match Monsters come alive 🔥💧🌿💨✨
