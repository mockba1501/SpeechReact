import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import SettingsPage from "./pages/SettingsPage";
//import HangmanGame from "./games/hangman/HangmanGame";
//import WordPuzzleGame from "./games/wordPuzzle/WordPuzzleGame";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/settings/:gameId" element={<SettingsPage />} />
  {/*    <Route path="/game/hangman" element={<HangmanGame />} />
      <Route path="/game/word-puzzle" element={<WordPuzzleGame />} />
      */}
    </Routes>
  </Router>
);

export default AppRoutes;
