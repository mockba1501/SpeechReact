import { useContext, useEffect, useRef, useState } from "react";

//Core Game Logic
import GameContext from "../../context/GameContext";
import GameKeyboard from "./GameKeyboard";
import useVoiceRecognition from "../../hooks/useVoiceRecognition";
//New logic to be implemented
//import ScoringPanel from "./ScoringPanel";
//import DifficultyControls from "./DifficultyControls";
//import HintDisplay from "./HintDisplay";
//import GameFeedback from "./GameFeedback";

//Styling
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const HangmanBoardV2 = ({settings, words}) => {
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
            setIsMicrophoneEnabled,
            wordIndex,
            setWordIndex,
            setAllWordsCompleted,
            gameStatsManager
             } = useContext(GameContext);    
    const { recognizedText, isListening, error, startListening, stopListening } = useVoiceRecognition();
    
    const [recognitionMessage, setRecognitionMessage] = useState({
        type: 'info',
        text: 'Press the mic button and say a letter'
    });

    //Reference for the hint element
    const hintRef = useRef(null);
    //const [hintDescription, setHintDescription] = useState("");
    const maxGuesses = 6;
    
    //Pass the game settings once you load the page 
    useEffect(() => {
        resetGameState();
        setWordIndex(0);
        gameStatsManager.resetStats();
        gameStatsManager.setSessionSettings(settings,"v2");
    },[])

    //Effect to initialize the game board with a random word
    useEffect(() => {
      //console.log("Selected Words:", words, " current word index ", wordIndex);

        resetGameState();
        if(words.length > 0 && wordIndex < words.length)
        {
            //console.log("Assigning new word to the game board!!!");
            //Get a random word from the word list
            const {word, hint} = words[wordIndex];
            hintRef.current.innerText = hint;
            //setHintDescription(hint);
            //console.log("Current word is: ", word);
            setCurrentWord(word);
            setCorrectLetters(new Array(word.length).fill(""));
            setIsGameReset(false);
        }

        if(wordIndex === words.length - 1)
        {
            //console.log("All words are completed");
            setAllWordsCompleted(true);
        }
    }, [wordIndex]); // I only need to activiate this effect when the wordIndex changes

    //Effect to check game status (win/lose) after each guess based on correct letters
    useEffect(() => {
        if(currentWord && correctLetters.length)
        {
            let finishGame = false;
            //console.log("Checking game status and current word is: ", currentWord);
            //if number of wrong guesses is greater than or equal to the max guesses, the game is lost
            //Lose Game Condition
            if(wrongGuesses >= maxGuesses)
            {
                setShowModal(true);
                setIsGameWon(false);
                finishGame = true;
            }
            //Win Game Condition
            else if(correctLetters.join("") === currentWord)
            {
                setShowModal(true);
                setIsGameWon(true);
                finishGame = true;
            }

            if(finishGame)
            {
                gameStatsManager.logFinishAttempt(currentWord, correctLetters, incorrectLetters);
            }
        }
    }, [correctLetters, wrongGuesses, currentWord, setIsGameWon, setShowModal]);
    
    const resetGameState = () => {
        //console.log("Resetting game state is called!!!");
        setCorrectLetters([]);
        setIncorrectLetters([]);
        setClickedKeys([]);
        setWrongGuesses(0);
        setIsGameWon(false);
        setIsGameReset(true); // Trigger the useEffect to initialize the new word
    };

    //Handle Key clicks and update the game state accordingly
    const handleClickedKey = (clickedKey) => {
        console.log("Clicked Key: ",clickedKey);

        // Skip if key was already guessed (correct or incorrect)
        if (clickedKeys.includes(clickedKey)) {
            console.log("Key already guessed:", clickedKey);
            return;
        }

        if(currentWord.includes(clickedKey))
        {
            const updatedCorrectLetters = correctLetters.map((letter,index)=>
                currentWord[index] === clickedKey ? clickedKey : letter
            );
            setCorrectLetters(updatedCorrectLetters);
            //console.log("Correct Letters: ",updatedCorrectLetters, " size of correct letters ",updatedCorrectLetters.length);
        }
        else
        {
            setIncorrectLetters((previousLetters) => [...previousLetters, clickedKey]);
            setWrongGuesses((previousGuesses) => previousGuesses + 1);
        }

        setClickedKeys((previousKeys) => [...previousKeys, clickedKey]);
        /*
        // Log the attempt
        gameStatsManager.logAttempt({
            recognitionMode: isMicrophoneEnabled ? "Microphone" : "Keyboard", // Track whether the attempt was made via voice or keyboard
            currentWord: currentWord, // The word being guessed
            correctLetters: correctLetters, // The current state of correct letters
            incorrectLetters: incorrectLetters, // The current state of incorrect letters
        });
        */
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
            {/* 
            <HintDisplay 
                currentWord={currentWord} 
                difficulty={settings.difficulty} 
                hintDescription={hintDescription} 
               hintImage={hintImage} 
            />*/}
             {
            <h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint:{" "}
                <b ref={hintRef} className="font-semibold text-neutral-700"></b>
            </h4>
            }

            {/* Display the number of incorrect guesses and max guesses */}
            {/**
             * <ScoringPanel score={score} wrongGuesses={wrongGuesses} maxGuesses={maxGuesses} />
             */}
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

export default HangmanBoardV2;