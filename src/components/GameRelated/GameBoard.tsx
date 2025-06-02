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
    const { recognizedText, isListening, error, startListening, stopListening } = useVoiceRecognition();
    
    const [recognitionMessage, setRecognitionMessage] = useState({
        type: 'info',
        text: 'Press the mic button and say a letter'
    });

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
        console.log("Clicked Key: ",clickedKey);

        // Skip if key was already guessed (correct or incorrect)
        if (clickedKeys.includes(clickedKey)) {
            console.log("Key already guessed:", clickedKey);
            return;
        }

        setClickedKeys((previousKeys) => [...previousKeys, clickedKey]);

        if(currentWord.includes(clickedKey) ) {  // Only add if not already present
        
            const updatedCorrectLetters = correctLetters.map((letter,index)=>
                currentWord[index] === clickedKey ? clickedKey : letter
            );
            setCorrectLetters(updatedCorrectLetters);
            console.log("Correct Letters: ",updatedCorrectLetters);
        }
        else {  // Only add if not already present
        
            setIncorrectLetters((previousLetters) => [...previousLetters, clickedKey]);
            setWrongGuesses((previousGuesses) => previousGuesses + 1);
        }
    };

    // Toggle keyboard visibility
    const toggleMicrophone = () => {
        //In case we listening, this should stop the microphone from listening
        if(isMicrophoneEnabled)
            stopListening();
        
        setIsMicrophoneEnabled(!isMicrophoneEnabled);
    };

    // Updated recognition handler
    useEffect(() => {
        console.log("Recognized Text: ", recognizedText);
        // Clear message after 3 seconds
        const timer = recognitionMessage? setTimeout(() => setRecognitionMessage(null), 3000) : null;

        if (!isListening) {
            setRecognitionMessage(null);
            
        }

        if (!recognizedText || recognizedText.length === 0) {
            setRecognitionMessage({
                type: 'error',
                text: 'Sorry could not recognize! Please try speaking clearly.'
            });
            return;
        }

        // Find best candidate (existing logic)
        console.log("Current Word: ", currentWord);
        const validLetters = recognizedText.filter(item => 
        {
            console.log("Item: ", item);
            return currentWord.includes(item.letter.toLowerCase())
        }
        );
        validLetters.sort((a, b) => b.confidence - a.confidence);
        console.log("Valid Letters: ", validLetters);
        const fallbackLetter = getFallbackLetter(recognizedText);

        // Determine action based on results
        if (validLetters.length > 0) {
            const bestLetter = validLetters[0].letter;
            setRecognitionMessage({
                type: 'success',
                text: `Recognized: ${bestLetter}`
            });
            handleClickedKey(bestLetter);
        } 
        else if (fallbackLetter) {
            setRecognitionMessage({
                type: 'warning',
                text: `Heard: ${fallbackLetter} (not in word)`
            });
            handleClickedKey(fallbackLetter);
        }
        else {
            setRecognitionMessage({
                type: 'error',
                text: 'No valid letters detected. Please try again.'
            });
        }

        return () => clearTimeout(timer);
    }, [recognizedText]);
    
    const getFallbackLetter = (results) => {
        if (!results || results.length === 0) return null;
        const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
        return sorted[0].letter;
    };

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

            {/* Display recognition messages */}
            {isMicrophoneEnabled && recognitionMessage && (
                <div className={`my-2 p-2 rounded text-center ${
                    recognitionMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                    recognitionMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                    {recognitionMessage.text}
                </div>
            )}

        </div>
    );
}

export default GameBoard;