import { useContext, useEffect, useRef, useState } from "react";

//Game Logic
import GameContext from "../../context/GameContext";
import GameKeyboard from "./GameKeyboard";
import useVoiceRecognition from "../../hooks/useVoiceRecognition";
import {wordList} from "../../constants";

//Styling
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const GameBoard = () => {
    const {currentWord,
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
            isMicrophoneEnabled,
            setIsMicrophoneEnabled } = useContext(GameContext);    
    const { recognizedText, isListening, error, startListening } = useVoiceRecognition();
    
    //Reference for the hint element
    const hintRef = useRef(null);
    const maxGuesses = 6;

    //Effect to initialize the game board with a random word
    useEffect(() => {
        //Get a random word from the word list
        const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
        hintRef.current.innerText = hint;
        setCurrentWord(word);
        setCorrectLetters(new Array(word.length).fill(""));
        setIsGameReset(false);
    }, [isGameReset, setCorrectLetters, setCurrentWord, setIsGameReset]);

    //Effect to check game status (win/lose) after each guess based on correct letters
    useEffect(() => {
        if(currentWord && correctLetters.length)
        {
            //if number of wrong guesses is greater than or equal to the max guesses, the game is lost
            if(wrongGuesses >= maxGuesses)
            {
                setShowModal(true);
                setIsGameWon(false);
            }
            else if(correctLetters.join("") === currentWord)
            {
                setShowModal(true);
                setIsGameWon(true);
            }
        }
    }, [correctLetters, wrongGuesses, currentWord, setIsGameWon, setShowModal]);
    
    //Handle Key clicks and update the game state accordingly
    const handleClickedKey = (clickedKey) => {
        if(currentWord.includes(clickedKey))
        {
            const updatedCorrectLetters = correctLetters.map((letter,index)=>
                currentWord[index] === clickedKey ? clickedKey : letter
            );
            setCorrectLetters(updatedCorrectLetters);
            console.log("Correct Letters: ",updatedCorrectLetters);
        }
        else
        {
            setIncorrectLetters((previousLetters) => [...previousLetters, clickedKey]);
            setWrongGuesses((previousGuesses) => previousGuesses + 1);
        }

        setClickedKeys((previousKeys) => [...previousKeys, clickedKey]);
        
    };

    // Toggle keyboard visibility
    const toggleMicrophone = () => {
        setIsMicrophoneEnabled(!isMicrophoneEnabled);
    };

    useEffect(() => {
        if (recognizedText) {
                handleClickedKey(recognizedText);
        }
    }, [recognizedText]);
    
    return (
        <div className="flex flex-col items-center">
            {/* Position the Switch inside the game's white container */}
            <Box
                sx={{
                    alignSelf: 'flex-end', // Align to the right
                    marginBottom: 4, // Add some spacing
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={!isMicrophoneEnabled}
                            onChange={toggleMicrophone}
                            color="primary"
                        />
                    }
                    label={isMicrophoneEnabled ? "Keyboard Off" : "Keyboard On"}
                    labelPlacement="start"
                />
            </Box>

            {/*Display the current word with guessed letters*/}
            <ul className="flex flex-wrap items-center justify-center gap-3">
                {currentWord?.split("").map((_, index) => (
                    <li key={index} className={`-mt-10 mb-10 w-7 text-center text-3xl font-semibold uppercase ${ !correctLetters[index] && "mt-0 border border-b-2 border-black"}`}>
                        {correctLetters[index]}
                    </li>
                ))}
            </ul>

            {/* Display the hint */}
            <h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint:{" "}
                <b ref={hintRef} className="font-semibold text-neutral-700"></b>
            </h4>

            {/* Display the number of incorrect guesses and max guesses */}
            <h4 className="mb-4 text-center text-lg font-medium text-neutral-800 max-md:text-base">
                Incorrect guesses:{" "}
                <b className="font-bold text-red-500">
                {wrongGuesses} / {maxGuesses}
                </b>
            </h4>
            
             {/* Display the game keyboard (hidden if microphone is enabled) */}
             {!isMicrophoneEnabled && (
                <GameKeyboard handleClickedKey={handleClickedKey} clickedKeys={clickedKeys} />
            )}

            {/* Show/Hide microphone button*/}
            {isMicrophoneEnabled && (
            <>
                <IconButton
                    onClick={startListening}
                    color={isListening ? "error" : "success"} // Red when listening, green when not
                    disabled={!isMicrophoneEnabled} // Disable if microphone is not enabled
                >
                    <MicRoundedIcon fontSize="large" />
                </IconButton>
                <Typography variant="body2" color={isListening ? "error" : "textSecondary"}>
                    {isListening ? "Listening..." : "Press the mic button to say a Letter"}
                </Typography>
                {incorrectLetters.length>0 && (<h4>
                    Incorrect Letters: {incorrectLetters.join(", ")}
                </h4>)
                }
            </>
            )}

        </div>
    );
}

export default GameBoard;