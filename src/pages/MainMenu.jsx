import { useNavigate } from "react-router-dom";

const games = [
  { id: "hangman", name: "Hangman", description: "Classic word guessing game." },
  { id: "word-puzzle", name: "Word Puzzle", description: "Solve the missing letters." },
  { id: "hangman2", name: "Hangman", description: "Classic word guessing game." },
  { id: "word-puzzle2", name: "Word Puzzle", description: "Solve the missing letters." },
  { id: "hangman3", name: "Hangman", description: "Classic word guessing game." },
  { id: "word-puzzle3", name: "Word Puzzle", description: "Solve the missing letters." }
];

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center px-3">
      <div className="flex w-[850px] flex-col items-center gap-8 rounded-lg bg-white px-10 py-14 shadow-xl max-md:px-6 max-md:py-10">
        <h1 className="text-3xl font-bold text-gray-800">Choose a Game</h1>

        <div className="grid w-full grid-cols-2 gap-6 max-md:grid-cols-1">
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => navigate(`/settings/${game.id}`)}
              className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-6 shadow-md transition hover:bg-gray-200 hover:shadow-lg cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-700">{game.name}</h2>
              <p className="text-sm text-gray-600">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
