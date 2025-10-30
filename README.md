# 🎮 Speech Therapy Games — Voice‑Powered Hangman Suite

An educational, accessible Hangman game suite powered by speech recognition. Players can guess letters or full words using their voice (or an on‑screen keyboard), with adaptive hints, difficulty levels, and post‑game feedback.

---

## 🚀 Features

- **Voice input (letters & words)**: Combines Microsoft Azure Cognitive Services Speech SDK with the Web Speech API for robust recognition.
- **On‑screen keyboard**: Optional manual input with clear visual feedback.
- **Multiple game modes**:
  - Hangman 2: Letter‑by‑letter guessing with instant feedback.
  - Hangman 3: Full‑word recognition with precision scoring.
- **Adaptive hints**: Images and text hints varying by difficulty.
- **Progress & feedback**: Post‑game feedback screen for quick insights.
- **Kid‑friendly settings**: Age groups, sound options, and word position settings.

---

## 🛠 Tech Stack

- React 18 + TypeScript
- Vite 6 (dev/build/preview)
- Azure Cognitive Services Speech SDK (`microsoft-cognitiveservices-speech-sdk`)
- Web Speech API fallback
- React Router 7
- Tailwind CSS
- Testing: Vitest + @testing-library/react
- Linting: ESLint

---

## ▶️ Quick Start

1) Prerequisites
- Node.js 18+ and npm
- An HTTPS‑capable browser (Chrome/Edge recommended) with microphone access
- Azure Speech resource (key + region) and a token service endpoint (see Environment)

2) Install
```bash
npm install
```

3) Configure environment
Create a `.env` file in the project root:
```bash
# Base URL for your token service (must expose /api/get-speech-token)
VITE_BASE_URL=https://your-backend.example.com

# Optional: Custom Speech model endpoint ID
VITE_APP_SPEECH_ENDPOINT=your-custom-endpoint-id
```

4) Run
```bash
npm run start
# Vite dev server starts; open the printed local URL
```

5) Build & preview
```bash
npm run build
npm run preview
```

6) Tests & lint
```bash
npm test
npm run lint
```

---

## 🌐 Environment & Token Service

The app does not store Azure keys in the client. Instead, it requests a short‑lived token from a backend endpoint and caches it in a cookie.

- Variable `VITE_BASE_URL` must point to a backend that exposes `GET /api/get-speech-token` and returns:
  ```json
  { "token": "<azure-speech-token>", "region": "<azure-region>" }
  ```
- Optional `VITE_APP_SPEECH_ENDPOINT` sets a Custom Speech endpoint ID for improved accuracy.
- Token retrieval logic lives in `src/token_util.ts` and is used by the hooks and main menu prefetch.

---

## 🧭 App Navigation

Routes are defined in `src/routes.tsx` and wrapped with `GameProvider`:

- `/` → Main menu
- `/settings/:gameId` → Game settings per mode
- `/word-selection/:gameId` → Word list selection (if applicable)
- `/game/hangman`, `/game/hangman2`, `/game/hangman3` → Game screens
- `/feedback` → Post‑game feedback page

The primary entry mounts `AppRoutes` in `src/main.tsx`.

---

## 🧩 Architecture Overview

- `context/GameContext.tsx` — Central game state: current word, guesses, modal state, microphone enablement, navigation helpers, and a `GameStatsManager` instance.
- `hooks/useVoiceRecognition.ts` — Per‑letter recognition. Merges results from Azure Speech SDK and Web Speech API, normalizes many letter pronunciations (e.g., "why" → "y").
- `hooks/useFullWordRecognition.ts` — Single‑utterance, full‑word recognition via Azure Speech SDK.
- `hooks/useMicrophone.ts` — Microphone availability and permission prompts used on the main menu and in games.
- `components/GameRelated/*` — Game boards, keyboard UI, modals, illustrations, and hint display.
- `pages/*` — Menu, settings, word selection, and feedback screens.

---

## 🎮 Game Modes

| Mode | Input | Hints | Best For |
|------|-------|-------|----------|
| Hangman 2 | Letter‑by‑letter (voice/keyboard) | Text + visuals | Younger learners / phonics |
| Hangman 3 | Full‑word (voice) | Timed + visuals | Older learners / advanced |

---

## 🔐 Browser & Permissions

- Mic permission is required for voice features. The main menu shows microphone and Azure token service status indicators.
- Voice recognition works best over HTTPS contexts.
- Chrome or Edge on desktop recommended; Safari may require additional permission flows.

---

## 📦 Scripts

- `npm run start` — Start Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview the production build
- `npm test` — Run unit tests with a UI
- `npm run lint` — Run ESLint across the project

---

## 📁 Notable Files

- `src/main.tsx` — App bootstrap
- `src/routes.tsx` — Routing and `GameProvider`
- `src/context/GameContext.tsx` — Shared game state
- `src/hooks/useVoiceRecognition.ts` — Letter recognition (Azure + Web Speech)
- `src/hooks/useFullWordRecognition.ts` — Full‑word recognition (Azure)
- `src/token_util.ts` — Token retrieval from backend

---

## 🧪 Testing

Vitest is configured with JSDOM and a global setup file:

- Config: `vite.config.js` → `test` section
- Setup: `vitest.setup.js`
- Example test: `src/components/GameRelated/HangmanBoardV3.test.jsx`

Run tests:
```bash
npm test
```

---

## ⚠️ Troubleshooting

- No mic detected: Ensure a physical microphone is available and selected by the OS.
- Permission denied: Click the mic status button in the main menu or allow mic permissions in the browser.
- Azure token offline: Verify `VITE_BASE_URL` and that your backend returns `{ token, region }`.
- Low accuracy for letters: Provide `VITE_APP_SPEECH_ENDPOINT` if you have a Custom Speech model; otherwise default improves via phrase hints.

---

## 📜 License

MIT License — see `LICENSE.md`.

### Third-Party Licenses
This project depends on third-party libraries that are licensed separately from the project’s MIT license. See `THIRD_PARTY_NOTICES.md`.
