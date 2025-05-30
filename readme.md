# Match Monsters

A web-based JavaScript game that fuses classic **match-3** puzzle mechanics with strategic **monster battling**.  
Make matches on an 8×8 elemental board to charge your team’s mana, evolve creatures, and unleash devastating abilities until your opponent’s HP hits zero.

---

## Table of Contents
1. [Gameplay Overview](#gameplay-overview)  
2. [Key Features](#key-features)  
3. [How to Play](#how-to-play)  
4. [Installation & Setup](#installation--setup)  
5. [Project Structure](#project-structure)  
6. [Technologies Used](#technologies-used)  
7. [Browser & Device Requirements](#browser--device-requirements)  
8. [Development Workflow](#development-workflow)  
9. [Contributing](#contributing)  
10. [License](#license)

---

## Gameplay Overview
Match Monsters is a turn-based duel for **2 players (local or AI)**:

| Phase | Description |
|-------|-------------|
| Monster Draft / All-Pick | Players select 2 monsters each. Draft mode alternates picks (P1 – P2,P2 – P1) while All-Pick lets both pick simultaneously (one per element). |
| Battle Loop | Each turn grants **2 moves**. Swap tiles to create matches of 3+. Matching 4+ grants **1 extra move**. |
| Mana & Abilities | Matching an element fills mana for monsters of that element. Full mana triggers the monster’s special attack automatically. |
| Berries, Evolution & Boost | Matching berries collects them. Spend 4 berries to evolve or, if already evolved, boost (+4 mana). Each costs 1 move. |
| Victory | Reduce the opposing player’s total HP to **0**. Second player receives +5 HP handicap in All-Pick mode. |

---

## Key Features
- 🧩 **Rich Match-3 Board** – 8×8 grid, gravity, cascades, shuffles & visual effects.  
- 🐲 **30+ Unique Monsters** – Distinct stats, elemental affinities, evolutions & abilities.  
- 💥 **Real-Time Abilities** – Automatic attacks, buffs, debuffs, DOT, stuns and more.  
- 🍓 **Evolution & Boost System** – Collect berries, power-up stats or turbo-charge mana.  
- 🔄 **Draft & All-Pick Modes** – Competitive monster selection with elemental bans.  
- ⚔️ **Turn-Based Multiplayer** – 2 moves per turn, extra-move combos, HP combat.  
- 🤖 **Optional AI** – Built-in monster/battle AI for solo play (normal difficulty).  
- 📱 **Responsive UI** – Works on desktop, tablet and mobile with touch/drag.  
- 💾 **Auto Save & Stats** – LocalStorage save-resume, lifetime stats, performance logs.  

---

## How to Play
1. **Start a New Game** → Select *Draft* or *All Pick*.  
2. **Pick Monsters**  
   - *Draft*: P1 picks 1 → P2 picks 2 → P1 picks 1.  
   - *All Pick*: Each player chooses 2; only one monster per element.  
3. **Battle**  
   1. You have **2 move gems**. Tap/drag to swap adjacent tiles and form matches.  
   2. Matching ≥4 tiles grants an **Extra Move** (max 1 per turn).  
   3. **Berry tiles** fuel evolutions/boosts (tap *Evolve* / *Boost* buttons).  
   4. Element matches charge your monsters’ mana; full mana auto-casts the ability.  
   5. When a player’s total HP is 0, the other wins.  
4. **View Monster Info** anytime via the *Monster Info* button or by clicking a slot.  
5. **Pause** with `P`, request a **hint** with `H` (developer option).

---

## Installation & Setup
### 1. Clone the Repo
```bash
git clone https://github.com/your-user/match-monsters.git
cd match-monsters
```

### 2. Install Dependencies  
No build step is required – everything is plain HTML/CSS/JS.  
Optional dev tooling uses **npm**:

```bash
npm install   # installs ESLint, Prettier, http-server (dev only)
```

### 3. Launch a Local Server
```bash
npx http-server -c-1 -p 8080
# or
python -m http.server 8080
```
Open http://localhost:8080 in your browser.

> ⚠️ Directly opening `index.html` with the `file://` protocol may block audio or LocalStorage in some browsers; use a local server.

---

## Project Structure
```
match-monsters/
├── index.html            # main app shell
├── css/
│   └── styles.css        # full UI & animation styling
├── js/
│   ├── constants.js      # config, enums, monster & stage data
│   ├── utils.js          # helpers, EventSystem, storage, math
│   ├── monsters.js       # Monster class, MonsterManager, AI
│   ├── board.js          # Tile & Board logic (canvas rendering)
│   ├── ui.js             # UI manager, modals, notifications
│   ├── game.js           # core game loop / state machine
│   └── main.js           # entry point, asset loader, PWA SW
├── assets/
│   ├── images/           # monster art, element icons, stages
│   └── sounds/           # FX & BGM (mp3/ogg)
└── readme.md
```

---

## Technologies Used
- **HTML5 Canvas** – high-performance tile rendering.  
- **Vanilla JavaScript (ES6)** – module-based architecture, no frameworks.  
- **CSS3 / Flex / Grid** – responsive layout & animations.  
- **LocalStorage** – save games & user preferences.  
- **Service Worker (optional)** – offline caching (PWA).  

---

## Browser & Device Requirements
| Requirement | Minimum |
|-------------|---------|
| ECMAScript | ES2015 (ES6) support |
| Canvas 2D  | Yes |
| LocalStorage | Yes |
| Screen Size | ≥ 360 × 640 |
| Tested Browsers | Chrome 109+, Firefox 108+, Edge 109+, Safari 16+ |
| Touch Support | Optional but supported |

High-DPI and mobile optimizations are applied automatically.

---

## Development Workflow
1. `npm run lint` – run ESLint for code quality  
2. `npm run format` – Prettier formatting  
3. `npm run dev` – start **http-server** with live reload (`--watch`)  
4. Source maps are plain; open DevTools for debugging.  

### Hot Tips
- **DEBUG_MODE** is enabled automatically on `localhost`; check the console for FPS counters & memory logs.  
- Press **H** in-game to reveal a valid match (debug only).  

---

## Contributing
Contributions, bug reports and suggestions are welcome!

1. Fork the repository and create your feature branch:  
   `git checkout -b feat/amazing-feature`
2. Commit your changes with clear messages.  
3. Ensure `npm run lint` passes and add unit tests where applicable.  
4. Push to the branch and open a **Pull Request** describing your changes.

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) (TBD) before contributing.

---

## License
Match Monsters is released under the **MIT License**.  
See the [LICENSE](LICENSE) file for full text.

---

*Happy matching & monster battling!*  
