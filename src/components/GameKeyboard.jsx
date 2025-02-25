const GameKeyboard = ({handleClickedKey, clickedKeys}) => {
    const alphabetArray = Array.from({length: 26}, (_, i) =>
        String.fromCharCode(97 + i)
    );
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
        </div>
    );
};

export default GameKeyboard;