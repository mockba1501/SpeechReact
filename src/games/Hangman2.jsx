import HangmanBoardV2 from "../components/GameRelated/HangmanBoardV2";
import GameOverModal from "../components/GameRelated/GameOverModal";
import HangmanIllustration from "../components/GameRelated/HangmanIllustration";
import GameContext from "../context/GameContext";
import { useLocation } from "react-router-dom";
import { useEffect, useContext } from "react";

const Hangman2 = () => {
    const location = useLocation();
    const { settings, words } = location.state || { settings: {}, words: [] };
    const { resetGameBoard } = useContext(GameContext); // Call reset function from context
    console.log("Selected Words:", words);

    useEffect(() => {
      const handleBackNavigation = (event) => {
        resetGameBoard();
      }

      window.addEventListener("popstate", handleBackNavigation);
      return () => {
        window.removeEventListener("popstate", handleBackNavigation);
      }
    }, []);

    return (
        // Wrapping the app with GameProvider for state management
        <>
          <div className="flex h-screen items-center justify-center px-3">
            <div className="flex w-[850px] items-end justify-between gap-16 rounded-lg bg-white px-10 py-14 shadow-xl max-md:flex-col max-md:items-center max-md:px-2.5 max-md:py-8">
              <HangmanIllustration />
              <HangmanBoardV2 settings={settings} words={words}/>
            </div>
            <GameOverModal isVersion2={true}/>
          </div>
        </>
      );
}

export default Hangman2
