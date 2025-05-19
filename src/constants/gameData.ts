interface GameDetails {
  id: string,
  name: string,
  description: string,
  requiresSettings: boolean,
  fetchWords: boolean,
  fetchPath: string,
  projectID: string
}

interface GameSetting {
  id: string,
  label: string,
  options: string[]
}

type GameSettings = Record<string, GameSetting[]>;
export type {GameDetails, GameSetting, GameSettings}

const HANGMAN_URL:string = import.meta.env.VITE_HANGMAN_WORD_API;
const HANGMAN_PROJECT_ID:string = import.meta.env.VITE_HANGMAN_PROJECT_ID;

if (!HANGMAN_URL || !HANGMAN_PROJECT_ID) {
  throw new Error("Missing required environment variables");
}

export const games: GameDetails[] = [
  { 
    id: "hangman", 
    name: "Voice Hangman", 
    description: "Original Hangman with Voice Input.",
    requiresSettings: false,
    fetchWords: false,
    fetchPath: "",
    projectID: ""
  },
  { 
    id: "hangman2", 
    name: "Custom Hangman", 
    description: "2nd Iteration with AI word generator.\nLetter by Letter Guessing",
    requiresSettings: true,
    fetchWords: true,
    fetchPath: HANGMAN_URL, 
    projectID: HANGMAN_PROJECT_ID
  },
  { 
    id: "hangman3", 
    name: "Hangman Levels", 
    description: "3rd Iteration with custom difficulty.\nFull pronounciation Varient",
    requiresSettings: true,
    fetchWords: true,
    fetchPath: HANGMAN_URL, 
    projectID: HANGMAN_PROJECT_ID
  },
  /*
  { 
    id: "word-puzzle2", 
    name: "Word Puzzle", 
    description: "Solve the missing letters.",
    requiresSettings: false,
    fetchWords: false,
    fetchPath: "", 
    projectID: ""
  },*/
];

/*
enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}
*/
export const gameSettings: GameSettings = {
    "hangman": [ ], // No settings available for Hangman
    "word-puzzle": [
      { id: "timeLimit", label: "Time Limit", options: ["30s", "60s", "90s"] },
      { id: "hints", label: "Hints Allowed", options: ["Yes", "No"] }
    ],
    "hangman2": [ { id: "age", label: "Age", options: ["5 to 7 years old", "8 to 13 years old", "14 to 17 years old", "more than 18 years old"] },
    { id: "sound", label: "Letter Sound", options: [ "/p/ – pat","/b/ – bat","/t/ – top","/d/ – dog","/k/ – cat","/g/ – go","/m/ – man","/n/ – net","/ŋ/ – sing","/f/ – fan","/v/ – van","/s/ – sun","/z/ – zoo","/ʃ/ – shoe","/ʧ/ – chair"] },
    { id: "position", label: "Letter Position", options: ["Beginning","Middle","End"]}
    ],
    "hangman3": [ { id: "age", label: "Age", options: ["5 to 7 years old", "8 to 13 years old", "14 to 17 years old", "more than 18 years old"] },
    { id: "sound", label: "Letter Sound", options: [ "/p/ – pat","/b/ – bat","/t/ – top","/d/ – dog","/k/ – cat","/g/ – go","/m/ – man","/n/ – net","/ŋ/ – sing","/f/ – fan","/v/ – van","/s/ – sun","/z/ – zoo","/ʃ/ – shoe","/ʧ/ – chair"] },
    { id: "position", label: "Letter Position", options: ["Beginning","Middle","End"]},
    { id: "difficulty", label: "Select Level", options: ["Easy","Medium","Hard"]}
    ]
  };