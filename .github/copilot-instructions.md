<!-- Copilot / AI agent instructions for Santa's Code Elves -->
# Copilot instructions — Santa's Code Elves

Purpose
- Help developers extend and debug the static HTML/CSS/JS mini-game site.

Big picture (what to know first)
- This is a client-side, static site (no build step). Two separate app shells exist:
  - Root demo quiz: `index.html` + `script.js` (top-level files) — simple quiz game.
  - Full site shell: `Santas_Code_Elves/index.html` with main controller at `assests/js/script.js`.
- The main shell loads mini-games into hidden containers (`game1Container`, `game2Container`, ...).
- Mini-games are implemented as self-contained modules that render HTML into their container and expose an init function (examples: `initGrinchHuntGame()` in `assests/js/game1-grinch.js`, `initMemoryGame()` in `assests/js/game2-memory.js`).

Key files and example patterns
- Main controller: `Santas_Code_Elves/assests/js/script.js`
  - Exposes `initGame()`, `openMiniGame(houseNumber)`, `returnToMainGame(gameWon)` and a global `gameState` object.
  - Houses are found via `.house` elements and `data-house` / `data-game` attributes.
- Mini-games: `assests/js/game1-grinch.js`, `assests/js/game2-memory.js`
  - Each module: 1) injects HTML into its container, 2) wires local listeners, 3) exposes start/stop functions, 4) calls `returnToMainGame(true)` on win.
  - Naming convention: `init<Feature>Game()` and cleanup helpers like `cleanupMemoryGame2()`.
- Styles: `assests/css/*` (note: directory name is spelled `assests` — keep this exact path when editing assets).
- Project README: `Santas_Code_Elves/README.md` documents features and level behavior useful for UX/requirements.

Conventions & important gotchas
- Asset folder typo: the project uses `assests/` (not `assets/`). Do not rename unless you update every reference.
- House state is represented in the DOM via classes and emoji text in `.house-status`:
  - Locked: class `locked` and `🔒` text
  - Unlocked: class `unlocked` and `🎮` text
  - Completed: class `completed` and `✅` text
- Mini-games update central state by calling `returnToMainGame(true)` when won — this is the canonical completion flow used by the main controller.
- UI wiring: the main shell queries and caches DOM nodes on `DOMContentLoaded` via `initGame()`; modifying element IDs requires updating `assests/js/script.js` accordingly.

How to add a new mini-game (concrete steps)
1. Add a new house node in `Santas_Code_Elves/index.html` with `data-house="N"` and `data-game` as needed.
2. Add a container div `#gameNContainer` (already present pattern for N=1..4) or reuse an existing one.
3. Create `assests/js/gameN-<name>.js` implementing `init<Name>Game()` and a cleanup function. Follow the structure in `game1-grinch.js`.
4. In `assests/js/script.js` add a `case N` to the `openMiniGame(houseNumber)` switch that calls your init and shows the container.
5. On win call `returnToMainGame(true)` to mark completion; follow UI emoji and class updates.

Local dev & run instructions (no build)
- The site is static; open `Santas_Code_Elves/index.html` directly in the browser for quick checks, but some browsers restrict module behavior when opened as `file://`.
- Recommended quick local server commands:
```bash
# from repository root
python -m http.server 8000
# or (node)
npx http-server . -p 8000
```
Open `http://localhost:8000/Santas_Code_Elves/index.html` after starting the server.

Debugging tips (targeted to this codebase)
- To trace level unlocks, set breakpoints in `assests/js/script.js` around `moveSantaToHouse()`, `unlockHouse()` and `completeCurrentHouse()`.
- Mini-game lifecycle: look for `init*`, `start*`, `cleanup*` functions inside `assests/js/game*.js` files.
- Watch for DOM ID/name mismatches caused by the `assests/` path typo and differing `script.js` files (root vs shell).
- Sound/Audio behavior uses WebAudio in mini-games (wrapped in try/catch); failures are non-fatal.

What NOT to change lightly
- Do not rename `assests/` without updating all references — many files use hard-coded paths like `assests/images/grinch.png`.
- Do not change the `returnToMainGame(gameWon)` contract — mini-games rely on it to update central progress.

Where to look for more context
- UI and level wiring: `Santas_Code_Elves/index.html` and `assests/js/script.js`.
- Mini-game examples: `assests/js/game1-grinch.js`, `assests/js/game2-memory.js`.
- High-level project notes and intended UX: `Santas_Code_Elves/README.md`.

If something is unclear
- Ask for the exact file to change and which level/house you want to modify — I will propose a minimal patch.

-- End of instructions
