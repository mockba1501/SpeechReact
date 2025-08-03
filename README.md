# 🎮 Voice-Powered Hangman Game

An educational and accessible **voice-powered Hangman game** with full-word pronunciation, designed for flexibility and child-friendly learning.

---

## 🚀 Features

- 🎤 **Speech Recognition**: Full-word voice input via Azure Cognitive Services
- 🎹 **Keyboard Input**: Optional manual input with interactive virtual keyboard
- 🧠 **Hint System**: Adaptive hint display based on difficulty settings (Easy, Medium, Hard)
- 📊 **Feedback Page**: Post-game insights showing accuracy, mistakes, and learning stats
- 👶 **Age-Appropriate Settings**: Targeted word lists and sounds per age group
- 🎯 **Full-Word Guessing**: Advanced pronunciation-based gameplay with precision scoring

---

## 🧩 Game Features

| Feature | Description |
|---------|-------------|
| Input Method | Full-word pronunciation |
| Hint System | Timed + audio + picture hints |
| Feedback Style | Accuracy + precision per attempt |
| Best For | All ages with pronunciation focus |

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
```
src/
│
├── components/
│ ├── GameRelated/
│ │ ├── HangmanBoard.tsx      # Main game board component
│ │ ├── GameKeyboard.tsx      # On-screen keyboard
│ │ ├── GameOverModal.tsx     # Game over modal
│ │ ├── HangmanIllustration.tsx # Hangman drawing
│ │ └── HintDisplay.tsx       # Hint system
│ └── Layout/
│   ├── BackButton.tsx 
│   ├── Layout.tsx 
│   └── NavBar.tsx
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
│ └── HangmanGame.tsx         # Main game component
│
├── hooks/
│ ├── useMicrophone.ts 
│ ├── usePronounce.ts
│ └── useFullWordRecognition.ts # Full-word recognition hook
│
├── pages/
│ ├── FeedbackPage.tsx        # Post-game feedback UI
│ ├── MainMenu.tsx            # Main Menu Game selection
│ ├── SettingsPage.tsx        # Settings Selection
│ └── WordSelectionPage.tsx   # Word Selection
│
└── assets/
    └── images/               # Game images and illustrations
```



