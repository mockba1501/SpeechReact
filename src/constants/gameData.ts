
//export type {GameDetails, GameSetting, GameSettings}

//const HANGMAN_URL:string = import.meta.env.VITE_HANGMAN_WORD_API;
//const HANGMAN_PROJECT_ID:string = import.meta.env.VITE_HANGMAN_PROJECT_ID;

const VOCAMETRIX_URL:string = import.meta.env.VITE_VOCAMETRIX_PLATFORM;
const VOCAMETRIX_URL_API:string = import.meta.env.VITE_VOCAMETRIX_API_KEY;

if (!VOCAMETRIX_URL || !VOCAMETRIX_URL_API) {
  throw new Error("Missing required environment variables");
}

export const games: GameDetails[] = [
  { 
    id: "hangman", 
    name: "Hangman Levels", 
    description: "Voice-enabled Hangman with custom difficulty.\nFull word pronunciation variant",
    requiresSettings: true,
    fetchWords: true,
    fetchPath: VOCAMETRIX_URL, 
    projectID: VOCAMETRIX_URL_API
  },
];

/*
enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}
*/
export const gameSettings: GameSettings = {
    "hangman": [ 
      { id: "age", label: "Age", options: ["5 to 7 years old", "8 to 13 years old", "14 to 17 years old", "more than 18 years old"] },
      { id: "sound", label: "Letter Sound", options: [ "/p/ – pat","/b/ – bat","/t/ – top","/d/ – dog","/k/ – cat","/g/ – go","/m/ – man","/n/ – net","/ŋ/ – sing","/f/ – fan","/v/ – van","/s/ – sun","/z/ – zoo","/ʃ/ – shoe","/ʧ/ – chair"] },
      { id: "position", label: "Letter Position", options: ["Beginning","Middle","End"]},
      { id: "difficulty", label: "Select Level", options: ["Easy","Medium","Hard"]}
    ]
  };