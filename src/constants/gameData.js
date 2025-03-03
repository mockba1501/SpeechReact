export const games = [
  { id: "hangman", name: "Classic Hangman", description: "Classic word guessing game." },
  { id: "hangman2", name: "Hangman", description: "Classic word guessing game." },
  { id: "word-puzzle", name: "Word Puzzle", description: "Solve the missing letters." },
  { id: "word-puzzle2", name: "Word Puzzle", description: "Solve the missing letters." },
  { id: "hangman3", name: "Hangman", description: "Classic word guessing game." },
  { id: "word-puzzle3", name: "Word Puzzle", description: "Solve the missing letters." }
];

export const gameSettings = {
    "hangman": [ ], // No settings available for Hangman
    "word-puzzle": [
      { id: "timeLimit", label: "Time Limit", options: ["30s", "60s", "90s"] },
      { id: "hints", label: "Hints Allowed", options: ["Yes", "No"] }
    ],
    "hangman2": [ { id: "age", label: "Age", options: ["5 to 7 years old", "8 to 13 years old", "14 to 17 years old", "more than 18 years old"] },
    { id: "sound", label: "Letter Sound", options: ["/p/ - pat", "/b/ - bat","/t/ - top","/d/ - dog","/k/  cat",
        "/g/ - go","/m/ - man","/n/ - net","/ŋ/ - sing","/f/ - fan","/v/ - van","/s/ - sun","/z/ - zoo","/ʃ/ - shoe","/ʧ/ - chair"] },
    { id: "position", label: "Letter Position", options: ["Beginning","Middle","End"]}
    ]
  };