import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//create a context for the game
const GameContext = createContext();

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
    const [isNextWordReady, setIsNextWordReady] = useState(false);
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
        setIsNextWordReady(false);
        setAllWordsCompleted(false);
    };

    const handleNextWord = () => {
        setIsNextWordReady(true);
        setShowModal(false);
        setWordIndex((prev) => prev + 1);
      //  resetGameBoard();
    };

    const handleRestart = () => {
        setAllWordsCompleted(false); // Reset completion state
        //setIsNextWordReady(true); // Restart the game
        setShowModal(false);
      //  resetGameBoard();
    };

    const handleStopPlaying = () => {
        // Navigate to the main menu or another screen
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
                isNextWordReady,
                setIsNextWordReady,
                allWordsCompleted,
                setAllWordsCompleted,
                handleNextWord,
                handleRestart,
                handleStopPlaying,
            }}>
            {children}
            </GameContext.Provider>
    );
    
}

export default GameContext;