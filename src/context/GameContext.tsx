import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameStatsManager from "./GameStatsManager";

interface GameContextType {
    currentWord: string;
    setCurrentWord: (word:string) => void;
    correctLetters: string[];
    setCorrectLetters: (letters: string[]) => void;
    incorrectLetters: string[];
    setIncorrectLetters: (letters: string[]) => void;
    clickedKeys: string[];
    setClickedKeys: (keys: string[]) => void;
    wrongGuesses: number;
    setWrongGuesses: (count: number) => void;
    isGameWon: boolean;
    setIsGameWon: (state: boolean) => void;
    showModal: boolean;
    setShowModal: (state: boolean) => void;
    isGameReset: boolean;
    setIsGameReset: (state: boolean) => void;
    resetGameBoard: () => void;
    isMicrophoneEnabled: boolean;
    setIsMicrophoneEnabled: (state: boolean) => void;
    wordIndex: number;
    setWordIndex: (index: number) => void;
    allWordsCompleted: boolean;
    setAllWordsCompleted: (state: boolean) => void;
    handleNextWord: () => void;
    handleRestart: () => void;
    handleFeedback: () => void;
    handleStopPlaying: () => void;
    gameStatsManager: GameStatsManager;
}
//create a context for the game
const GameContext = createContext<GameContextType| undefined>(undefined);
const gameStatsManager = new GameStatsManager();

interface GameProviderProps {
    children: ReactNode;
}
//Provider component to manage game state and provide it to children components
export const GameProvider = ({ children }:GameProviderProps) => {
    const [currentWord, setCurrentWord] = useState<string>("");
    const [correctLetters, setCorrectLetters] = useState<string[]>([]);
    const [incorrectLetters, setIncorrectLetters] = useState<string[]>([]);
    const [clickedKeys, setClickedKeys] = useState<string[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState<number>(0);
    const [isGameWon, setIsGameWon] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isGameReset, setIsGameReset] = useState<boolean>(false);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState<boolean>(true);
    const [wordIndex, setWordIndex] = useState<number>(0);
    const [allWordsCompleted, setAllWordsCompleted] = useState<boolean>(false);
    
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
        console.log("Game board is reset!!!");
    };

    const handleNextWord = () => {
        setShowModal(false);
        setWordIndex((prev) => prev + 1);
        console.log("Next word button is triggered!!")
      //  resetGameBoard();
    };

    const handleRestart = () => {
        setAllWordsCompleted(false); // Reset completion state
        setShowModal(false);
        setWordIndex(0);
        resetGameBoard();
        console.log("Restart Operation");
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