import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameStatsManager from "./GameStatsManager";

//create a context for the game
const GameContext = createContext();
const gameStatsManager = new GameStatsManager();

//Provider component to manage game state and provide it to children components
export const GameProvider = ({ children }) => {
    const [currentWord, setCurrentWord] = useState("");
    const [correctLetters, setCorrectLetters] = useState([]);
    const [incorrectLetters, setIncorrectLetters] = useState([]);
    const [clickedKeys, setClickedKeys] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isGameWon, setIsGameWon] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isGameReset, setIsGameReset] = useState(false);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
    const [wordIndex, setWordIndex] = useState(0);
    const [allWordsCompleted, setAllWordsCompleted] = useState(false);
    
    const navigate = useNavigate();

    //function to reset the game to its initial state
    const resetGameBoard = () => {
        setCurrentWord("");
        setCorrectLetters([]);
        setIncorrectLetters([]);
        setClickedKeys([]);
        setWrongGuesses(0);
        setIsGameWon(false);
        setShowModal(false);
        setIsGameReset(true);
        setIsMicrophoneEnabled(true);
        setWordIndex(0);
        setAllWordsCompleted(false);
    };

    const handleNextWord = () => {
        setShowModal(false);
        setWordIndex((prev) => prev + 1);
      //  resetGameBoard();
    };

    const handleRestart = () => {
        setAllWordsCompleted(false); // Reset completion state
        setShowModal(false);
        resetGameBoard();
    };

    const handleFeedback = () => {
        // Navigate to the feedback page
        resetGameBoard();
        setShowModal(false);
        
        navigate("/feedback");
    };
    const handleStopPlaying = () => {
        // Navigate to the main menu
        resetGameBoard();
        setShowModal(false);
        
        navigate("/");
    };

    //Provide the state and functions to the children components
    return (
        <GameContext.Provider
            value={{
                currentWord,
                setCurrentWord,
                correctLetters,
                setCorrectLetters,
                incorrectLetters,
                setIncorrectLetters,
                clickedKeys,
                setClickedKeys,
                wrongGuesses,
                setWrongGuesses,
                isGameWon,
                setIsGameWon,
                showModal,
                setShowModal,
                isGameReset,
                setIsGameReset,
                resetGameBoard,
                isMicrophoneEnabled,
                setIsMicrophoneEnabled,
                wordIndex,
                setWordIndex,
                allWordsCompleted,
                setAllWordsCompleted,
                handleNextWord,
                handleRestart,
                handleFeedback,
                handleStopPlaying,
                gameStatsManager
            }}>
            {children}
            </GameContext.Provider>
    );
    
}

export default GameContext;