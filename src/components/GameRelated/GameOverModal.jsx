import { useContext } from "react";

import GameContext from "../../context/GameContext";

const GameOverModal = ({isVersion2 = false}) => {
    const {currentWord, 
            isGameWon,
            showModal,
            handleNextWord,
            handleRestart,
            handleFeedback,
            handleStopPlaying,
            allWordsCompleted,
            resetGameBoard
        } = useContext(GameContext);
        
        console.log("All words completed: ", allWordsCompleted);

    return (
        //Model container with conditional visibility
        <div className={`inset fixed z-10 flex h-full w-full items-center justify-center 
            bg-[rgba(0,0,0,0.5)] px-3 backdrop-blur-lg 
            ${showModal ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} 
             transition-opacity duration-300`}
        >
            <div className="flex max-w-[420px] flex-grow flex-col items-center rounded-lg border bg-white p-7 text-center shadow-2xl">
                {/* Display appropriate gif based on game outcome */}
                <img className="mb-5 max-w-32 max-md:w-28" src={showModal ? `/images/${isGameWon ? 'won' : 'lost'}.gif` : ''} alt="Gif" />
        
                {/* Display game outcome message */}
                <h4 className="text-2xl font-bold">
                {showModal && (isGameWon ? "Congratulations!" : "Better Luck Next Time!")}
                </h4>
                
                {/* Display game result and the correct word */}
                <p className="mb-8 mt-4 text-xl max-lg:text-lg">
                {isGameWon ? "You guessed the word" : "The correct word was"}
                <br />
                <b className="font-bold uppercase text-emerald-700">{" "} {showModal && currentWord}</b>
                </p>
                
                {/* Display Play Again button 
                <button
                onClick={resetGameBoard}
                className="max-lg:2 rounded-md border bg-emerald-700 px-5 py-2.5 font-medium uppercase text-white hover:bg-emerald-600 max-lg:px-4"
                >
                Play Again
                </button>
                */}
                <div className="flex justify-center gap-4"> {/* Flex container with gap */}
                {isVersion2 ? (
                    // Version 2: Sequential Words Game & V3
                    allWordsCompleted ? (
                        <button
                            onClick={handleFeedback}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Go to Feedback
                        </button>
                    ) : (
                        <button
                            onClick={handleNextWord}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Next Word
                        </button>
                    )
                ) : (
                    // Version 1: Original Game
                    <>
                        <button
                            onClick={handleRestart}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={handleStopPlaying}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Stop Playing
                        </button>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}

export default GameOverModal;