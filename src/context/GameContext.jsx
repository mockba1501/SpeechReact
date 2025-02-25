import { createContext, useState } from "react";

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
                setIsMicrophoneEnabled
            }}>
            {children}
            </GameContext.Provider>
    );
    
}

export default GameContext;