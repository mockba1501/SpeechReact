import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";

import MainMenu from "./pages/MainMenu";
import SettingsPage from "./pages/SettingsPage";
import WordSelectionPage from "./pages/WordSelectionPage";
import FeedbackPage from "./pages/FeedbackPage";

import HangmanGame from "./games/HangmanGame";
import Hangman2 from "./games/Hangman2";
import Hangman3 from "./games/Hangman3";

import Layout from "./components/Layout/Layout";

//import WordPuzzleGame from "./games/wordPuzzle/WordPuzzleGame";

const AppRoutes = () => (
  
    <Router>
      <GameProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainMenu />} />
          <Route path="/settings/:gameId" element={<SettingsPage />} />
          <Route path="/game/hangman" element={<HangmanGame />} />
          <Route path="/game/hangman2" element={<Hangman2 />} />
          <Route path="/game/hangman3" element={<Hangman3 />} />
          <Route path="/word-selection/:gameId" element={<WordSelectionPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Route>
        
      </Routes>
      </GameProvider>
    </Router>
  
);

export default AppRoutes;
