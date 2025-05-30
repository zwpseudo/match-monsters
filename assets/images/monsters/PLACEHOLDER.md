# Monster Portrait Assets Guide

This document describes every **portrait image** the game engine expects, required specs, and best-practice art guidelines. Replace the built-in placeholders with real artwork and simply refresh the browser—no build step needed.

---

## 1. Required Portraits (v1 roster)

| ID | Monster Name | Element |
|----|--------------|---------|
| 01 | Emberclaw    | Fire  |
| 02 | Aquafin      | Water |
| 03 | Terravine    | Earth |
| 04 | Zephyrwing   | Air   |
| 05 | Lumiglow     | Light |
| 06 | Magmahorn    | Fire  |
| 07 | Coralshell   | Water |
| 08 | Crystalspike | Earth |
| 09 | Mistwisp     | Air   |
| 10 | Prismbeam    | Light |

File names **must match the monster’s `portrait` field** in `js/constants.js`  
(e.g. `emberclaw.png`, `aquafin.png`, …). Use lower-case and hyphens instead of spaces.

---

## 2. Image Specifications

| Property            | Requirement                                   |
|---------------------|-----------------------------------------------|
| Format              | **PNG** (preferred) with alpha transparency   |
| Dimensions          | **≥ 256 × 256 px** square (engine auto-scales)|
| Background          | Transparent (leave margin ~10 px)             |
| Color Space         | sRGB, 8-bit                                   |
| File Size Target    | ≤ 150 KB (optimize with pngquant/tinyPNG)     |
| Naming Convention   | `monster-name.png` (kebab-case)               |

> Larger resolutions are safe—the renderer down-sizes for thumbnails and keeps full res in the info modal.

---

## 3. Where Portraits Appear in-game

1. **Monster Slots** – small square thumbnails beside HP/mana bars.  
2. **Draft / All-Pick Cards** – grid of selectable monsters during team selection.  
3. **Monster Info Modal** – large portrait (150 px) with stats & ability text.  
4. **Battle UI Hover** – shows evolved form highlight.  
5. **End-Game Screen** – winner’s active monsters.

Good clarity at 64 px is therefore essential.

---

## 4. Art & Style Guidelines

| Topic | Recommendations |
|-------|-----------------|
| Composition | Center character; avoid cropping extremities. Leave ~8–10 px padding to prevent UI masks cutting edges. |
| Pose & Readability | ¾ view or frontal; keep silhouette recognizable at thumbnail size. |
| Background | Transparent; optional faint shadow to ground the sprite. No busy backdrops. |
| Lighting | Consistent top-left light source across roster. |
| Elemental Color Hints | Include subtle color cues (e.g., glowing ember effects for Fire) but **don’t rely solely on color**—shape language matters. |
| Evolution Consistency | If supplying evolved forms later, maintain recognisable features so players see lineage. Suggested file naming: `emberclaw_evolve.png`. |
| Line & Render | Clean lines, antialiased edges. Avoid heavy gradients that band at small sizes. |
| No Text | Do **not** embed names or stats in the image; UI handles labels. |
| File Optimization | Run PNG through lossless compression (pngcrush, zopflipng, etc.). |
| Licensing | Use only art you own or have permission to redistribute. Note license/credits in `assets/images/ATTRIBUTION.md` if required. |

---

## 5. Adding New Monsters

1. Add the portrait PNG to `assets/images/monsters/`.  
2. Add monster data to `MONSTERS` array in **`js/constants.js`** with `portrait: 'assets/images/monsters/your-monster.png'`.  
3. Hard refresh. The loader will automatically include the new asset.

---

### Happy illustrating!  
Drop in your PNGs, reload the page, and watch your monsters come to life in Match Monsters. 🐉✨
