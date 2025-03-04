import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainMenu from "./pages/MainMenu";
import SettingsPage from "./pages/SettingsPage";
import WordSelectionPage from "./pages/WordSelectionPage";

import HangmanGame from "./games/HangmanGame";
import Hangman2 from "./games/Hangman2";

import Layout from "./components/Layout";
import App from "./App";
//import WordPuzzleGame from "./games/wordPuzzle/WordPuzzleGame";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainMenu />} />
        <Route path="/settings/:gameId" element={<SettingsPage />} />
        <Route path="/game/hangman" element={<HangmanGame />} />
        <Route path="/game/hangman2" element={<Hangman2 />} />
        <Route path="/word-selection/:gameId" element={<WordSelectionPage />} />
    {/*    <Route path="/game/word-puzzle" element={<WordPuzzleGame />} />
        */}
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
