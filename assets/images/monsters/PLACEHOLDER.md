# Monster Portrait Assets Guide

This document explains every **portrait image** Match Monsters loads, along with art specs and naming rules.  
The engine now prefers the modern **WebP** format for monster art (smaller files, same quality), but will gracefully fall back to PNG if a WebP is missing.

---

## 1. Required Portraits (current roster)

| ID | Monster Name | Evolution (if any) | Element | File Name |
|----|--------------|--------------------|---------|-----------|
| 001 | Bonzumi | – | Fire | `bonzumi.webp` |
| 002 | Bonzire | – | Fire | `bonzire.webp` |
| 003 | Pelijet | – | Water | `pelijet.webp` |
| 004 | Sephanix | – | Water | `sephanix.webp` |
| 005 | Turtlelisk | – | Earth | `turtlelisk.webp` |
| 006 | Karaggon | – | Earth | `karaggon.webp` |
| 007 | Slickitty | – | Electric | `slickitty.webp` |
| 008 | Axelraze | – | Electric | `axelraze.webp` |
| 009 | Barbenin | – | Psychic | `barbenin.webp` |
| 010 | Scoprikon | – | Psychic | `scoprikon.webp` |
| 011 | Pyrokun | – | Fire | `pyrokun.webp` |
| 012 | Magnooki | – | Fire | `magnooki.webp` |
| 013 | Trashark | – | Water | `trashark.webp` |
| 014 | Shardivore | – | Water | `shardivore.webp` |
| 015 | Elfini | – | Earth | `elfini.webp` |
| 016 | Eidelf | – | Earth | `eidelf.webp` |
| 017 | Winklit | – | Electric | `winklit.webp` |
| 018 | Gleamur | – | Electric | `gleamur.webp` |
| 019 | Timingo ⭐ | – | Fire | `timingo.webp` |
| 020 | Flambagant ⭐ | – | Fire | `flambagant.webp` |

> **⭐ Rare Monsters** – appear only under special conditions but still need portraits.

---

## 2. Image Specifications

| Property            | Recommendation (WebP)                |
|---------------------|---------------------------------------|
| Format              | **WebP** (lossy or loss-less)         |
| Dimensions          | **≥ 256 × 256 px** square (engine auto-scales) |
| Transparency        | Supported (use alpha where needed)    |
| File Size Target    | ≤ 80 KB (WebP ~40–60 % smaller than PNG) |
| Color Space         | sRGB, 8-bit                           |
| Naming Convention   | `monster-name.webp` (lower-case, kebab-case) |

### Why WebP?

* 📦 **Smaller files** → faster loading, less bandwidth  
* 🌈 **High quality** even at high compression  
* 🟰 **Alpha transparency** like PNG  
* 🌐 **Wide browser support** (Chrome, Edge, Firefox, Safari 14+)  

---

## 3. Backward-Compatibility (PNG)

The loader will attempt to fetch `*.webp`.  
If the file **doesn’t exist** or the browser doesn't support WebP it will automatically look for `*.png` with the **same base name**.  
You can keep legacy PNGs in the folder as a fallback without breaking anything.

---

## 4. Where Portraits Appear

1. **Monster Slots** – 64 × 64 px thumbnail beside HP/mana bars  
2. **Selection Cards** – 90–120 px grid during Draft / All-Pick  
3. **Monster Info Modal** – 150 px square portrait  
4. **End-Game Screen** – winner’s active monsters  

Make sure artwork is readable at thumbnail size.

---

## 5. Art & Style Guidelines (unchanged)

| Topic | Recommendations |
|-------|-----------------|
| Composition | Center character; leave ∼10 px padding to avoid UI clipping. |
| Pose & Readability | Front or ¾ view silhouette that stays clear at 64 px. |
| Background | Transparent; subtle ground shadow optional. |
| Lighting | Consistent top-left light. |
| Elemental Cues | Include color/effects hinting element but rely on silhouette first. |
| Evolution Consistency | Maintain recognisable features between forms. |
| No Text | UI provides names – don’t embed text in art. |
| Optimization | Export WebP at quality 70–80, then run `cwebp -m 6`. |
| Licensing | Only include assets you own or have permission to distribute. Credit in `ATTRIBUTION.md` if needed. |

---

## 6. Adding Future Monsters

1. Save portrait as WebP in `assets/images/monsters/`.  
2. Reference it in `MONSTERS` array (`portrait: 'assets/images/monsters/new-monster.webp'`).  
3. Hard refresh – the loader picks it up automatically.

---

### Happy illustrating!  
Swap in your `.webp` art, refresh the page, and watch your monsters come to life. 🐉✨

