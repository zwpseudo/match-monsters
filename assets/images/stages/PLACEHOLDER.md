# Stage Background Assets Guide

This document explains every **stage background** image Match Monsters needs, technical specs, and recommended art guidelines.  
Replace the placeholders with real artwork, refresh the browser, and you’re done—no build step required.

---

## 1. Required Stage Backgrounds

| Stage ID | Display Name         | Element Bonus | Mandatory File Name |
|----------|----------------------|---------------|---------------------|
| `volcano`  | **Volcano Arena**       | Fire   | `volcano.jpg` |
| `ocean`    | **Deep Ocean Trench**   | Water  | `ocean.jpg`   |
| `forest`   | **Ancient Forest**      | Earth  | `forest.jpg`  |
| `mountain` | **Floating Mountains**  | Air    | `mountain.jpg`|
| `temple`   | **Radiant Temple**      | Light  | `temple.jpg`  |

> Keep file names lower-case as shown; the engine loads them via `STAGES` array in `js/constants.js`.

---

## 2. Image Specifications

| Property        | Recommendation                                      |
|-----------------|------------------------------------------------------|
| Format          | **JPG** (preferred) or PNG (if transparency needed) |
| Resolution      | **1920 × 1080 px** or larger, 16:9 aspect            |
| Orientation     | Landscape                                           |
| Color Space     | sRGB, 8-bit                                         |
| File Size       | ≤ 350 KB after compression (mozjpeg / tinypng)       |
| Naming Rule     | `<stage-id>.jpg` (see table above)                  |

The engine down-scales on smaller screens, so higher resolutions are fine.

---

## 3. How Backgrounds Are Used In-Game

* Applied as **CSS `background-image`** to the main game container during battle.  
* Covered by the match-3 board (center) and side panels; avoid critical detail behind UI.  
* A subtle *parallax / zoom* effect may be added later—leave safe margin (~5%) on all edges.  
* No tiling; single image stretched with `background-size: cover`.

---

## 4. Art & Style Guidelines

| Topic                 | Recommendations |
|-----------------------|-----------------|
| **Visual Clarity**    | Use diffused lighting and low-contrast centers so tiles remain readable. |
| **Elemental Theme**   | Incorporate colors/motifs hinting the bonus element (e.g., lava reds for Volcano). |
| **Depth & Layers**    | Foreground silhouette + soft mid-ground + blurred backdrop creates depth without clutter. |
| **Safe Zones**        | Keep bright highlights away from the exact board area (approx. center 640 × 640 px). |
| **Consistency**       | Maintain similar perspective, horizon line, and lighting direction across all stages. |
| **Compression**       | Export at 80–85 % JPG quality; run through an optimizer to keep load times fast. |
| **Licensing**         | Only use assets you own / can redistribute. Add credits to `assets/images/ATTRIBUTION.md` if required. |

---

## 5. Adding New Stages

1. Add the background image in `assets/images/stages/` (follow specs).  
2. Append a new stage object to `STAGES` in **`js/constants.js`** with `background: 'assets/images/stages/<file>.jpg'`.  
3. Hard-refresh. The stage will appear in the game.

---

### Happy painting!  
A well-crafted backdrop makes battles feel epic without stealing the spotlight from the monsters and the board. 🎨
