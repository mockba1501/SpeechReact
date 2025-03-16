import { useNavigate } from "react-router-dom";
import { games, gameSettings } from "../constants/gameData";

const MainMenu = () => {
  const navigate = useNavigate();
  
  const handleGameSelection = (gameId) => {
    if (gameSettings[gameId]?.length > 0) {
      navigate(`/settings/${gameId}`);
    } else {
      navigate(`/game/${gameId}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center px-3">
      <div className="flex w-[850px] flex-col items-center gap-8 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10">
        <h1 className="text-3xl font-bold text-gray-800">Choose a Game</h1>

        <div className="grid w-full grid-cols-2 gap-6 max-md:grid-cols-1">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelection(game.id)}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-6 shadow-md transition hover:bg-gray-200 hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-700">{game.name}</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line text-center">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
