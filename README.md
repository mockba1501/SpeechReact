# 🎮 Hangman Game Suite

An educational and accessible **voice-powered Hangman game**, designed with flexibility, multiple game modes, and child-friendly themes.

---

## 🚀 Features

- 🎤 **Speech Recognition**: Supports voice input via full-word or per-letter recognition modes.
- 🎹 **Keyboard Input**: Optional manual input with interactive virtual keyboard.
- 🧠 **Hint System**: Adaptive hint display based on difficulty settings (Easy, Medium, Hard).
- 📊 **Feedback Page**: Post-game insights showing accuracy, mistakes, and learning stats.
- 👶 **Age-Appropriate Settings**: Targeted word lists and sounds per age group.
- 🧪 **Game Modes**:
  - **Hangman V2**: Letter-by-letter guessing with categorized feedback.
  - **Hangman V3**: Full-word guessing with precision scoring and advanced feedback.

---

## 🧩 Game Modes

| Version | Input Method      | Hint System    | Feedback Style              | Best For            |
|---------|-------------------|----------------|-----------------------------|---------------------|
| V2      | Letter-by-letter  | Basic text     | Shows correct/incorrect     | Younger learners    |
| V3      | Full-word         | Timed + audio + picture | Accuracy + precision per attempt | Older learners & advanced users |

---

## 🛠 Technologies Used

- **React + TypeScript**
- **Material UI** for UI components
- **Web Speech API** / **Azure Cognitive Services** for voice input
- **Context API** for state management
- **Custom Hooks** for reusable voice recognition logic
- **Local Storage** for saving game stats (optional)

---

## 📁 Project Structure
src/
│
├── components/
│ ├── GameBoard.tsx # Original version of the game
│ ├── HangmanBoardV2.tsx # Letter-based game
│ ├── HangmanBoardV3.tsx # Full-word game with scoring
│ ├── GameKeyboard.tsx # On-screen keyboard
│ ├── GameOverModal.tsx # Contextual hint system
│ ├── HangmanIllustration.tsx # Contextual hint system
│ └── HintDisplay.tsx # Contextual hint system
|
├── Layout/
│ ├── BackButton.tsx 
│ ├── Layout.tsx 
│ └── NavBar.tsx
│
├── constants/
│ ├── gameData.ts
│ └── index.ts
│
├── context/
│ ├── GameContext.tsx
│ └── GameStatsManager.tsx
│
├── games/
│ ├── Hangman2.tsx
│ ├── Hangman3.tsx
│ └── HangmanGame.tsx
│
├── hooks/
│ ├── useMicrophone.ts 
│ ├── usePronounce.ts
│ ├── useVoiceRecognition.ts # Letter recognition hook (V2)
│ └── useFullWordRecognition.ts# Word recognition hook (V3)
|
├── pages/
│ ├── FeedbackPage.tsx      # Post-game feedback UI
│ ├── MainMenu.tsx          # Main Menu Game selection
│ ├── SettingsPage.tsx      # Settings Selection
│ └── WordSelectionPage.tsx # Handles Words Selection
|
└── assets/
└───── images/ # Hint images (optional)



