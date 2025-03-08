import HangmanBoardV3 from "../components/GameRelated/HangmanBoardV3";
import GameOverModal from "../components/GameRelated/GameOverModal";
import HangmanIllustration from "../components/GameRelated/HangmanIllustration";
import { GameProvider } from "../context/GameContext";
import { useLocation } from "react-router-dom";

const Hangman3 = () => {
    const location = useLocation();
    const { settings, words } = location.state || { settings: {}, words: [] };
    console.log("Selected Words:", words);

    return (
        // Wrapping the app with GameProvider for state management
        <GameProvider>
          <div className="flex h-screen items-center justify-center px-3">
            <div className="flex w-[850px] items-end justify-between gap-16 rounded-lg bg-white px-10 py-14 shadow-xl max-md:flex-col max-md:items-center max-md:px-2.5 max-md:py-8">
              <HangmanIllustration />
              <HangmanBoardV3 settings={settings} words={words}/>
            </div>
            <GameOverModal isVersion2={true}/>
          </div>
        </GameProvider>
      );
}

export default Hangman3
