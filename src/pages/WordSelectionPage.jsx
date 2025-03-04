import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const WordSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { gameId } = useParams();
    const { settings, words } = location.state || { settings: {}, wordChoices: [] };
    const [selectedWords, setSelectedWords] = useState([]);

    const toggleWord = (word) => {
        setSelectedWords((prev) =>
            prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
        );
    };

    const handleStartGame = () => {
        console.log(settings);
        navigate(`/game/${gameId}`, { state: { settings, words: selectedWords } });
    };

    return (
        <div className="mt-4">
            <h3 className="font-bold">Select Words for the Game:</h3>
            <div className="grid grid-cols-2 gap-2">
                {words.map((item) => (
                    <button
                        key={item.word}
                        onClick={() => toggleWord(item)}
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
                onClick={handleStartGame} 
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={words.length === 0}
            >
                Start Game
            </button>

            <button 
            onClick={() => navigate(`/settings/${gameId}`)} 
            className="bg-red-500 text-white px-4 py-2 rounded"
            >
                ⬅ Back
            </button>
            </div>
        </div>
    );
};

export default WordSelection;
