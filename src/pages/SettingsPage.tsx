import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { games, gameSettings } from "../constants/gameData";

const SettingsPage = () => {
  const { gameId } = useParams<{gameId: string}>();
  const navigate = useNavigate();

  const settings: GameSetting[] = gameSettings[gameId as keyof GameSetting] || [];
  const gameDetails: GameDetails|undefined = games.find((g:GameDetails) => g.id === gameId);
  
  // Handle missing game first
  if (!gameDetails) {
    return (
      <div className="flex flex-col gap-6 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black-600">Sorry the Game you are trying to access could not be found!</h1>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Return to Main Menu
          </button>
        </div>
      </div>
    );
  }

  type SelectedSettings = Record<string,string>;
  //Initialize the selected settings with default values
  const [selectedSettings, setSelectedSettings] = useState<SelectedSettings>(() =>
    settings.reduce((acc, setting) => ({
      ...acc,
      [setting.id] : setting.options[0]
    }), {} as SelectedSettings)
  );
  const [wordChoices, setWordChoices] = useState<WordItem[]>([]);   // Store words to be used in the game
  const [loading, setLoading] = useState(false);        // Loading state
  const [wordsFetched, setWordsFetched] = useState(false); // Ensure that words fetched successfully
  
  const fetchWordChoices = async () => {
    console.log("Trying to fetch words...");
    if (!gameDetails.fetchWords) return; // Skip API call if not needed
    
    
    setLoading(true);
    
    const payload = {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'X-API-Key': gameDetails.projectID
         },
        body: JSON.stringify({ 
              language: "en-US", // By default English for the time being
              age: selectedSettings.age,
              selectedSound: {
                symbol: selectedSettings.sound,
                position: selectedSettings.position,
              }
        }),
    };
    console.log(payload)

    try {
        const response = await fetch(gameDetails.fetchPath, payload );
        const result = await response.json();
        if (response.ok) 
        {
          const parsedResponse = JSON.parse(result.response);
          console.log("Parsed Response:", parsedResponse);
          const wordArray = parseWordsAndHints(parsedResponse);
          if (wordArray) {
            //const wordArray = parsedResponse.words.split('; ');
            console.log("Word Array" , wordArray)
            setWordChoices(wordArray);
            setWordsFetched(true);
          }
        
          console.log(`\n💳 Remaining credits: ${result.remaining_credits}`);
          
        } else {
          console.log('Error:', result.error);
          if (result.details) {
            console.log('Details:', result.details);
          }
          if (result.remaining_credits !== undefined) {
            console.log(`Remaining credits: ${result.remaining_credits}`);
          }
        }
      } catch (error) {
        console.error("Error fetching words:", error);
    }

    setLoading(false);    
  };

    const parseWordsAndHints = (data: { words: string; hints: string }): WordItem[] => {
    const wordList = data.words.split(";").map(w => w.trim()).filter(Boolean);
    const hintList = data.hints.split(";").map(h => h.trim()).filter(Boolean);

    const result: WordItem[] = [];

    for (let i = 0; i < Math.min(wordList.length, hintList.length); i++) {
      result.push({
        word: wordList[i],
        hint: hintList[i]
      });
    }

    return result;
  }
  useEffect(() => {
    if (wordsFetched && wordChoices.length > 0) {
      console.log("Proceeding to Word Selection Page...");
      navigate(`/word-selection/${gameId}`, { state: { settings: selectedSettings, words: wordChoices } });
    }
  }, [wordChoices, wordsFetched, navigate, gameId, selectedSettings]);

  const handleChange = (id:string, value:string) => {
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
        <p className="text-gray-600">Configure your settings for {gameId?.replace("-", " ")}.</p>

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

        {gameDetails.fetchWords && (
          <button 
                onClick={fetchWordChoices} 
                className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
                disabled={loading}
            >
                {loading ? "Loading..." : "Generate Words"}
        </button>
        )}

        {!gameDetails.fetchWords && (
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
