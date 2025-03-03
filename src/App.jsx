// Importing necessary components and context
import GameBoard from "./components/GameBoard";
import GameOverModal from "./components/GameOverModal";
import HangmanIllustration from "./components/HangmanIllustration";
import { GameProvider } from "./context/GameContext";
import NavBar from "./components/NavBar";
import MainMenu from "./pages/MainMenu";

// Main application component
export default function App() {
  return (
    <>
    <MainMenu/>
    </>
  );
}