import { useMemo, useCallback } from "react";

interface GameKeyboardProps {
    handleClickedKey: (key:string) => void;
    clickedKeys: string[];
    isVersion2?: boolean;
}

const GameKeyboard = ({handleClickedKey, clickedKeys,isVersion2 = false}:GameKeyboardProps) => {
    const alphabetArray = useMemo(() =>  
        Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)),[]
    );

    // Function to handle backspace
    const handleBackspace = useCallback(() => {
        handleClickedKey("Backspace"); // Send a special key to the parent component
    }, [handleClickedKey]);

    //console.log(alphabetArray);
    return (
        <div className="mt-9 flex flex-wrap justify-center gap-1">
            {
                alphabetArray.map((char) => (
                <button onClick={()=> handleClickedKey(char)}
                disabled={clickedKeys.includes(char)}
                key={char}
                className={`w-[calc(100%/9-5px)] rounded-md border bg-emerald-700 py-1.5 font-semibold text-white hover:bg-emerald-600 
                    ${clickedKeys.includes(char) && "pointer-events-none opacity-60"}`}
                >
                    {char.toUpperCase()}
                </button>
            ))}

            {/* Backspace button */}
            {isVersion2 && (
            <button
                onClick={handleBackspace}
                className="w-[calc(100%/9-5px)] rounded-md border bg-red-600 py-1.5 font-semibold text-white hover:bg-red-500"
            >
                ⌫ {/* Unicode for backspace symbol */}
            </button> 
            )}
        </div>
    );
};

export default GameKeyboard;