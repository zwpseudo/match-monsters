# Sound Assets Guide

This document explains every audio file **Match Monsters** looks for at start-up, what it is used for, and how to replace / extend the default placeholders.

---

## 1. Required Files

| File name       | Purpose (trigger)                       | Suggested length | Notes |
| --------------- | --------------------------------------- | ---------------- | ----- |
| `match.mp3`     | Plays **each time a match of 3+ tiles** is confirmed | ≤ 0.4 s | Short “chime” / “pop” |
| `swap.mp3`      | Successful **tile swap** that does *not* create a match | ≤ 0.3 s | Subtle “click” |
| `invalid.mp3`   | **Invalid swap** (tiles return to place) | ≤ 0.3 s | Dull “thud” / “buzz” |
| `evolve.mp3`    | Monster **evolves** after 4 berries      | 0.5 – 1 s       | Ascending “power-up” |
| `boost.mp3`     | Monster **boosts** mana                  | 0.4 – 0.7 s     | Energetic “spark” |
| `attack.mp3`    | Monster **ability fires**                | 0.5 – 1 s       | Element themed; can vary by element later |
| `damage.mp3`    | Monster **takes damage**                 | 0.4 – 0.7 s     | Impact “hit” |
| `victory.mp3`   | **Game won**                             | 1 – 2 s         | Triumphant fanfare |
| `defeat.mp3`    | **Game lost**                            | 1 – 2 s         | Sad jingle |
| `bgm.mp3`       | **Background music** loop                | 60 – 180 s      | Seamless loop recommended |

> The loader first tries `.mp3`; you may also supply an `.ogg` with the **same base name** for broader browser support.

---

## 2. Technical Recommendations

* **Format**: `mp3` (128–192 kbps CBR) or `ogg` (q5).  
* **Channels**: Mono for SFX, Stereo for music.  
* **Sample rate**: 44.1 kHz.  
* **Peak level**: \-1 dBFS max; **normalize** loudness to about \-14 LUFS.  
* **File size**: keep SFX < 50 KB where possible.  
* **Looping BGM**: Leave 50 ms of silence at start and set loop points to avoid clicks.

---

## 3. Where to Put the Files

```
assets/
└── sounds/
    ├── fx/        (optional, organise as you wish)
    ├── music/
    ├── match.mp3
    └── … etc.
```

*The engine simply loads from `assets/sounds/` root; sub-folders are allowed but keep paths consistent if you change them in `js/main.js → assetsToLoad`.*

---

## 4. Replacing a Placeholder

1. Export / download your sound and name it exactly as shown in the table.  
2. Drop it into `assets/sounds/`.  
3. Hard-refresh the browser (⇧-Reload) – no build step required.

If a file is **missing**, the loader logs a warning in **DEBUG mode** and the game continues silently; this is ideal during early development.

---

## 5. Adding Custom Sounds

Want unique element attacks, UI bleeps, or stage ambience?

1. Add a new entry to the `assetsToLoad` array in **`js/main.js`**:

```js
{ type: 'audio', id: 'lava_field', src: 'assets/sounds/lava_field.mp3' }
```

2. In code (e.g., `board.js` or `game.js`) play it via:

```js
ASSETS.items['lava_field'].play();
```

3. Keep IDs unique and follow the technical guidelines above.

---

### Enjoy fine-tuning your audio!  
Good sound design elevates the *feel* of Match Monsters – take the time to polish it. 🎧
