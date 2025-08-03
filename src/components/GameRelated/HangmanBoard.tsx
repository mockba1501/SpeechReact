import { useContext, useEffect, useState } from "react";

//Core Game Logic
import GameContext from "../../context/GameContext";
import GameKeyboard from "./GameKeyboard";
import useFullWordRecognition from "../../hooks/useFullWordRecognition";

import HintDisplay from "./HintDisplay";

//Styling
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const HangmanBoard = ({settings, words}:{ settings: GameSettingsMap; words: WordItem[] }) => {
    const {currentWord,
            setCurrentWord,
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
            gameStatsManager,
            } = useContext(GameContext);    

    const { recognizedWord, isListening, error, startListening, stopListening } = useFullWordRecognition();
    const [categorizedLetters, setCategorizedLetters] = useState<Array<CategorizedLetter>>([]);
    const [userSpelling, setUserSpelling] = useState<string[]>([]);

    //Reference for the hint element
    const [hintDescription, setHintDescription] = useState("");
    const maxGuesses = 6;
    //Effect to initialize the game board with a random word
    console.log("Passed words: ", words);
    //Pass the game settings once you load the page 
    useEffect(() => {
        setWordIndex(0);
        resetGameState();
        gameStatsManager.resetStats();
        gameStatsManager.setSessionSettings(settings);
    },[])
    
    useEffect(() => {
        resetGameState();

        console.log("Current words:",words);
        if(words.length > 0 && wordIndex < words.length)
        {
            const {word, hint} = words[wordIndex];
            console.log("Words",words,"current word", word,"the hint", hint);
            setHintDescription(hint);
            //console.log("Current word is: ", word);
            setCurrentWord(word);
            setIsGameReset(false);
        }

        if(wordIndex === words.length - 1)
        {
            //console.log("All words are completed");
            setAllWordsCompleted(true);
        }
    }, [wordIndex, words]); // I only need to activiate this effect when the wordIndex changes

    //Logic to detect the correct letters and their positions
    useEffect(() => {
        console.log("Microphone Mode!!");
        //check if recognized word or currentWord is not null or empty
        if(!recognizedWord || !currentWord  || isGameReset || recognizedWord.trim() === "") {
            setCategorizedLetters([]);
            return;
        }
        
        const categorized = categorizeLetters(currentWord, recognizedWord);
        setCategorizedLetters(categorized);

        // Check if the recognized word matches the current word
       checkMatchingWords(currentWord, recognizedWord);

       gameStatsManager.logAttempt({
        recognitionMode: "Microphone",
        currentWord, 
        attemptWord: recognizedWord, 
        categorizedWord: categorized, 
    });

    }, [recognizedWord]);
    
    
      // Effect to categorize letters when the user completes spelling
      useEffect(() => {
        const spelledWord = userSpelling.join("");
        

        if(!spelledWord || !currentWord  || isGameReset || spelledWord.trim() === "") {
            setCategorizedLetters([]);
            return;
        }

        console.log("Keyboard Mode!!");
        
        if (userSpelling.length === currentWord.length) {
            const categorized = categorizeLetters(currentWord, spelledWord);
            setCategorizedLetters(categorized);

            // Check if the recognized word matches the current word
            checkMatchingWords(currentWord, spelledWord);

            gameStatsManager.logAttempt({
                recognitionMode: "Keyboard",
                currentWord, 
                attemptWord: spelledWord, 
                categorizedWord: categorized, 
            });
        }
    }, [userSpelling]);

    const checkMatchingWords = (currentWord:string, checkWord:string) =>
    {
        //console.log("Checking Words ", currentWord, " ", checkWord);
        if (checkWord.toLowerCase() === currentWord.toLowerCase()) {
            setIsGameWon(true);
            setShowModal(true);
        } else {
            setWrongGuesses((prev) => prev + 1);
            if (wrongGuesses + 1 >= maxGuesses) {
                setShowModal(true);
                setIsGameWon(false);
            }
        }
    }

    const resetGameState = () => {
        console.log("Resetting game state is called!!!");
        //setWordIndex(0);
        setClickedKeys([]);
        setWrongGuesses(0);
        setIsGameWon(false);
        setIsGameReset(true); // Trigger the useEffect to initialize the new word
        setCategorizedLetters([]);
        setUserSpelling([]);
      //  gameStatsManager.resetStats();
    };

    const categorizeLetters = (targetWord:string, userWord:string):CategorizedLetter[] => {
        const targetArray = targetWord.toLowerCase().split("");
        const userArray = userWord.toLowerCase().split("");
        const categorized = new Array(targetArray.length).fill(null);
        const matchedIndices = new Set(); // Track indices in targetArray that have been matched
    
        // First pass: Check for correct letters in the correct position (green)
        userArray.forEach((letter, index) => {
            if (targetArray[index] === letter) {
                categorized[index] = { letter, color: "green" };
                matchedIndices.add(index); // Mark this index as matched
            }
        });
    
        // Second pass: Check for correct letters in the wrong position (yellow)
        userArray.forEach((letter, index) => {
            if (categorized[index]) return; // Skip if already categorized as green
    
            const targetIndex = targetArray.findIndex(
                (targetLetter, i) => targetLetter === letter && !matchedIndices.has(i)
            );
    
            if (targetIndex !== -1) {
                categorized[index] = { letter, color: "yellow" };
                matchedIndices.add(targetIndex); // Mark this index as matched
            } else {
                categorized[index] = { letter, color: "red" }; // Incorrect letter
            }
        });
    
        //console.log("Finished word categorization", categorized);
        return categorized;
    };

    const handleClickedKey = (clickedKey:string) => {
        if (clickedKey === "Backspace") {
            // Remove the last character from userSpelling
            if(userSpelling.length !== 0 && userSpelling.length !== currentWord.length)
                setUserSpelling((prevSpelling) => prevSpelling.slice(0, -1));
        } else if(userSpelling.length < currentWord.length) {
            // Reset categorization if the user starts typing again
            if (userSpelling.length === 0) {
                setCategorizedLetters([]);
            }
            setUserSpelling((prevSpelling) => [...prevSpelling, clickedKey]);
        }
        else{
            setUserSpelling([clickedKey]);
            setCategorizedLetters([]);
        }
    };

    // Toggle keyboard visibility
    const toggleMicrophone = () => {
        //In case we listening, this should stop the microphone from listening
        if(isMicrophoneEnabled)
            stopListening();

        setIsMicrophoneEnabled(!isMicrophoneEnabled);
        setCategorizedLetters([]);
        setUserSpelling([]);
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
                {currentWord?.split("").map((_, index) => {

                    const categorizedLetter = categorizedLetters[index]; // Get the current letter object
                    const userLetter = isMicrophoneEnabled? categorizedLetters[index]?.letter:userSpelling[index];
                    //console.log(userLetter);
                    return (
                        <li
                            key={index}
                            className={`-mt-10 mb-10 w-7 text-center text-3xl font-semibold uppercase ${
                                !categorizedLetter && "mt-0 border border-b-2 border-black"
                            }`}
                            style={{ color: categorizedLetter?.color || 'black' }} // Black while typing, colored after categorization
                        >
                            {userLetter || ""}
                        </li>
                    )}
                )}
            </ul>

            {/* Display the hint */}
            <HintDisplay 
                currentWord={currentWord} 
                difficulty={(settings.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy'}
                hintDescription={hintDescription} 
            />

            {/*  hintImage={hintImage} */} 
            {/* {
            <h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint:{" "}
                <b ref={hintRef} className="font-semibold text-neutral-700"></b>
            </h4>
            }*/}

            {/* Display the number of incorrect guesses and max guesses */}
            {/**
             * <ScoringPanel score={score} wrongGuesses={wrongGuesses} maxGuesses={maxGuesses} />
             */}
            <h4 className="mb-4 text-center text-lg font-medium text-neutral-800 max-md:text-base">
                Incorrect attempts:{" "}
                <b className="font-bold text-red-500">
                {wrongGuesses} / {maxGuesses}
                </b>
            </h4>
            
             {/* Display the game keyboard (hidden if microphone is enabled) */}
             {!isMicrophoneEnabled && (
                <GameKeyboard handleClickedKey={handleClickedKey} clickedKeys={clickedKeys} isVersion2={true} />  
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
                    {isListening ? "Listening..." : "Press the mic button to pronounce the word"}
                </Typography>
            </>
            )}

            {/** 
             * {showFeedback && <GameFeedback score={score} />}
             */}

        </div>
    );
}

export default HangmanBoard;