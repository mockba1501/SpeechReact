import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const WordSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { gameId } = useParams<{ gameId: string }>();
    const { settings, words } = location.state || { settings: {}, words: [] };
    const [selectedWords, setSelectedWords] = useState<WordItem[]>([]);

    const toggleWord = (word:WordItem) => {
        setSelectedWords((prev) =>
            prev.includes(word) ? prev.filter((w) => w.word !== word.word) : [...prev, word]
        );
    };

    const handleStartGame = () => {
        console.log(settings);
        navigate(`/game/${gameId}`, { state: { settings, words: selectedWords } });
    };

    return (
    <div className="flex h-screen items-center justify-center px-3">
        <div className="flex w-[850px] flex-col gap-6 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10">
            <h1 className="text-3xl font-bold text-gray-800">Select Words for the Game</h1>
            <p className="text-gray-600">Choose at least one word or more from the list below.</p>

            <div className="grid sm:grid-cols-2 gap-2 grid-cols-1 max-h-[60vh] overflow-y-auto">
                {words.map((item:WordItem) => (
                    <button
                        key={item.word}
                        onClick={() => toggleWord(item)}
                        aria-pressed={selectedWords.some(w => w.word === item.word)}
                        className={`px-4 py-2 border rounded ${
                            selectedWords.includes(item) ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}
                    >
                        {item.word} - {item.hint}
                    </button>
                ))}
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button 
            onClick={() => navigate(`/settings/${gameId}`)} 
            className="bg-red-500 text-white px-4 py-2 rounded"
            >
                ⬅ Back
            </button>

            <button 
                onClick={handleStartGame} 
                className={`bg-green-600 text-white px-4 py-2 rounded ${
                    selectedWords.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={selectedWords.length === 0} // Disable when no words are selected
                title={selectedWords.length === 0 ? "Select at least one word to start" : ""}
            >
                Start Game
            </button>

            </div>
        </div>
    </div>
    );
};

export default WordSelection;
