import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { games, gameSettings } from "../constants/gameData";
import { wordList } from "../constants";

const SettingsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const settings = gameSettings[gameId] || [];
  const game = games.find((g) => g.id === gameId);
  
  //Initialize the selected settings with default values
  const [selectedSettings, setSelectedSettings] = useState(() =>
    settings.reduce((acc, setting) => {
      acc[setting.id] = setting.options[0];
      return acc;
    }, {})
  );
  const [wordChoices, setWordChoices] = useState([]);   // Store words to be used in the game
  const [loading, setLoading] = useState(false);        // Loading state
  const [wordsFetched, setWordsFetched] = useState(false); // Ensure that words fetched successfully
  
  const fetchWordChoices = async () => {
    console.log("Trying to fetch words...");
    if (!game.fetchWords) return; // Skip API call if not needed
    
    setLoading(true);
    
    const payload = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          "params": 
                  {
                      "position": selectedSettings.position,
                      "age": selectedSettings.age,
                      "sound": selectedSettings.sound
                  },
          "project": game.projectID }),
    }
    console.log(payload)

    try {
        const response = await fetch(game.fetchPath, payload );
        const data = await response.json();
        const cleanString = data.output.answer
            .replace(/```json\n/, '') // Remove opening backticks and JSON identifier
            .replace(/```/g, '') // Remove closing backticks
            .replace(/\n/g, ''); // Remove newlines

        //Parse the internal JSON string
        try {
            const result = JSON.parse(cleanString);
            setWordChoices(result); // Store received words
            setWordsFetched(true);
            console.log(result);
            } catch (error) {
            console.error("Error parsing JSON:", error);
        }
        
    } catch (error) {
        console.error("Error fetching words:", error);
    }
    setLoading(false);
    

    //const data = wordList;
    //console.log(data);
    //setWordChoices(data);
    //setWordsFetched(true);
    
  };

  useEffect(() => {
    if (wordsFetched && wordChoices.length > 0) {
      console.log("Proceeding to Word Selection Page...");
      navigate(`/word-selection/${gameId}`, { state: { settings: selectedSettings, words: wordChoices } });
    }
  }, [wordChoices, wordsFetched, navigate, gameId, selectedSettings]);

  const handleChange = (id, value) => {
    setSelectedSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartGame = () => {
    console.log("Clicked Start Game");
    navigate(`/game/${gameId}`, { state: {settings: selectedSettings}});
  };

  return (
    <div className="flex h-screen items-center justify-center px-3">
      <div className="flex w-[850px] flex-col gap-6 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10">
        <h1 className="text-3xl font-bold text-gray-800">Game Settings</h1>
        <p className="text-gray-600">Configure your settings for {gameId.replace("-", " ")}.</p>

        <div className="flex flex-col gap-4">
          {settings.length > 0 ? (
            settings.map((setting) => (
              <div key={setting.id} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">{setting.label}</label>
                <select
                  className="mt-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
                  onChange={(e) => handleChange(setting.id, e.target.value)}
                >
                  {setting.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No settings available for this game.</p>
          )}
        </div>

        {game.fetchWords && (
          <button 
                onClick={fetchWordChoices} 
                className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
                disabled={loading}
            >
                {loading ? "Loading..." : "Fetch Words"}
        </button>
        )}

        {!game.fetchWords && (
          <button
          onClick={handleStartGame}
          className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          Start Game
        </button>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;
