import React, { useEffect } from 'react';

const HintDisplay = ({ currentWord, difficulty, hintDescription, hintImage }) => {
    const playWordSound = (word) => {
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (difficulty === 'easy') {
            // Show the word and play the sound
            displayWord(currentWord);
            playWordSound(currentWord);
        } else if (difficulty === 'medium') {
            // Show the word for a few seconds, then hide it
            displayWord(currentWord);
            playWordSound(currentWord);
            const timer = setTimeout(() => {
                hideWord();
            }, 3000);
            return () => clearTimeout(timer);
        } else if (difficulty === 'hard') {
            // Only play the word sound
            playWordSound(currentWord);
        }
    }, [currentWord, difficulty]);

    const displayWord = (word) => {
        // Function to display the word (you can manage visibility here)
        // This could update a state to trigger a re-render
    };

    const hideWord = () => {
        // Function to hide the word
        // This could update a state to trigger a re-render
    };

    return (
        <div>
            <h4 className="mb-4 text-center text-lg font-medium max-md:text-base">
                Hint: {hintDescription}
            </h4>
            {/*hintImage && <img src={hintImage} alt="Hint" />*/}
        </div>
    );
};

export default HintDisplay;
