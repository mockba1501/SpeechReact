import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gameSettings } from "../constants/gameData";

const SettingsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const settings = gameSettings[gameId] || [];
  const [selectedSettings, setSelectedSettings] = useState({});

  const handleChange = (id, value) => {
    setSelectedSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartGame = () => {
    navigate(`/game/${gameId}`, { state: selectedSettings });
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

        <button
          onClick={handleStartGame}
          className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
