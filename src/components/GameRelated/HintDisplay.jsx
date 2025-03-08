import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const HintDisplay = ({ currentWord, difficulty, hintDescription, hintImage }) => {
    const [isWordVisible, setIsWordVisible] = useState(false);

    const playWordSound = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        console.log("Current Difficulty is ", difficulty)
        if (difficulty === 'Easy') {
            // Show the word and play the sound
            setIsWordVisible(true);
            playWordSound(currentWord);
        } else if (difficulty === 'Medium') {
            // Show the word for a few seconds, then hide it
            setIsWordVisible(true);
            playWordSound(currentWord);
            const timer = setTimeout(() => {
                setIsWordVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else if (difficulty === 'Hard') {
            setIsWordVisible(false);
            playWordSound(currentWord);
        }
    }, [currentWord, difficulty]);

    return (

        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
                <h4>Pronounce the word, Click to Listen:</h4>
                <IconButton onClick={() => playWordSound(currentWord)} color="primary">
                    <VolumeUpIcon fontSize="large" />
                </IconButton>
            </div>

            {isWordVisible && (
            <h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint the word is: <b>{currentWord}</b>
            </h4>
            )}
            {/*<h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint: {hintDescription}
            </h4>*/}
            {/*hintImage && <img src={hintImage} alt="Hint" />*/}
        </div>
    );
};

export default HintDisplay;
