import { useContext } from "react";
import GameContext from "../context/GameContext";

const HangmanIllustration = () => {
    //Extract the wrong guesses value from the GameContext
    const { wrongGuesses } = useContext(GameContext);

    return (
        <div>
        {/* The hangman illustration is displayed based on the number of wrong guesses */}  
        <img 
            src={`/images/hangman-${wrongGuesses}.svg`} 
            alt="Hangman Illustration" 
            className="pointer-events-none max-w-[270px] select-none max-md:max-w-[200px]"
        />
        <h2 className="mt-6 text-center text-2xl font-bold uppercase max-md:hidden">Hangman Game</h2>
        </div>
    );
};

export default HangmanIllustration;