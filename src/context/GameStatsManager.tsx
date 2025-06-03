interface SessionSettings {
  gameVersion: "V2" | "V3"
}

interface BaseAttempt {
  recognitionMode?: string;
  gameVersion: "V2" | "V3";
  timestamp: number;
}

interface V2Attempt extends BaseAttempt {
  clickedKey?:string;
  isCorrect?: boolean;
  correctLetters: string[];
  incorrectLetters: string[];
}

interface V3Attempt extends BaseAttempt {
  attemptWord?: string;
  categorizedWord?: Array<{color: "green" | "yellow" | "red"} | null>
}

class GameStatsManager {
  private attemptsByWord: Record<string, Array<V2Attempt|V3Attempt>>;
  private sessionSettings: SessionSettings;

  constructor() {
    this.attemptsByWord = {}; // Store attempts grouped by word
    this.sessionSettings = {gameVersion: "V2"}; //Store the game session setting
  }

  //Start game session function (Responsible for logging Settings, selectedWords, startTime, finishTime)
  setSessionSettings(currentSettings:Record<string,any>,gameVersion: "V2"|"V3"):void
  {
    console.log("Game session started:", currentSettings, "Version:", gameVersion);
    this.sessionSettings = {...currentSettings, gameVersion};
  }

  logAttempt(params:{ 
    recognitionMode:string, 
    currentWord:string, 
    attemptWord?:string|null, 
    categorizedWord?:Array<{color: "green" | "yellow" | "red"} | null>,
    clickedKey?:string, 
    isCorrect?:boolean }):void {
    
    const { gameVersion } = this.sessionSettings;
    const {recognitionMode, currentWord, attemptWord, categorizedWord, clickedKey, isCorrect} = params;
    
    if (gameVersion === "V2" && (categorizedWord || attemptWord) ) {
        throw new Error("V2 does not use categorizedWord or attemptWord");
    }

    if (gameVersion === "V3" && (clickedKey || isCorrect)) {
        throw new Error("V3 does not use clickedKey or isCorrect");
    }

    if (!this.attemptsByWord[currentWord]) {
      this.attemptsByWord[currentWord] = [];
    }

    const attemptInfo: V2Attempt|V3Attempt = {
      recognitionMode,
      gameVersion,
      timestamp: Date.now(),
      //...(gameVersion === "v2" && { clickedKey, isCorrect }),
      //...(gameVersion === "v3" && { attemptWord, categorizedWord }),
    };

    if (gameVersion === "V2") {
      (attemptInfo as V2Attempt).clickedKey = clickedKey;
      (attemptInfo as V2Attempt).isCorrect = isCorrect;
    } else if (gameVersion === "V3") {
      (attemptInfo as V3Attempt).attemptWord = attemptWord || "";
      (attemptInfo as V3Attempt).categorizedWord = categorizedWord ?? [];
    }

    this.attemptsByWord[currentWord].push(attemptInfo);
  }

  logFinishAttempt(currentWord:string, correctLetters:string[], incorrectLetters:string[])
  {
    const { gameVersion } = this.sessionSettings;
    console.log("Logging Finish Attempt ", currentWord, correctLetters, incorrectLetters);

    if (!this.attemptsByWord[currentWord]) {
      this.attemptsByWord[currentWord] = [];
    }

    const attemptInfo = {
      gameVersion,
      timestamp: Date.now(),
      correctLetters: correctLetters,
      incorrectLetters: incorrectLetters
    }

    this.attemptsByWord[currentWord].push(attemptInfo);
  }
  
  getTotalMistakes():number {
    const { gameVersion } = this.sessionSettings;
    let totalMistakes = 0;

    for (const word in this.attemptsByWord) {
      const attempts = this.attemptsByWord[word];
      let hasCorrectAttempt = false;
      
      // Count how many attempts were made before getting the correct word
      for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];

        if (gameVersion === "V2" && 'incorrectLetters' in attempt) {
          //const isCorrect = attempt.correctLetters.length === word.length && attempt.incorrectLetters.length === 0;
          //if (isCorrect) {// Mistakes = number of wrong attempts before this
            totalMistakes += attempt.incorrectLetters.length; 
            //hasCorrectAttempt = true;
            //break;
        } else if (gameVersion === "V3" && 'categorizedWord' in attempt && attempt.categorizedWord) {
          const isCorrect = attempt.categorizedWord.every(l => l?.color === "green");
          if (isCorrect) {
            totalMistakes += i; // Mistakes = number of wrong attempts before this
            hasCorrectAttempt = true;
            break;
          }
        }
      }
      
      if(!hasCorrectAttempt)
          totalMistakes += attempts.length;
    }

    return totalMistakes;
  }

  getWordsPlayed():string[] {
      return Object.keys(this.attemptsByWord);
  }

  getAccuracyForWord(word:string):number {
    const { gameVersion } = this.sessionSettings;
    const attempts = this.getAttemptsForWord(word);

    if (attempts.length === 0) return 0; // Prevent errors when no attempts exist
    
    if (gameVersion === "V2") {
      // For v2, use the last attempt (final state of the word)
      const lastAttempt = attempts[attempts.length - 1];
      if (!lastAttempt  || !('correctLetters' in lastAttempt)) return 0;
  
      const totalLetters = word.length;
      const correctLetters = lastAttempt.correctLetters.filter((letter:string) => letter !== "").length;
      const accuracy = (correctLetters / totalLetters) * 100 || 0;
      return Math.round(accuracy); // Round to nearest integer
    } else if (gameVersion === "V3") {
      // For v3, calculate accuracy based on correct attempts
      const correctAttempts = attempts.filter((attempt) => {
      
      'categorizedWord' in attempt &&
      Array.isArray(attempt.categorizedWord) &&

      // Check if all non-null letters are green
      attempt.categorizedWord.every((letter) => {
        if (letter === null) return true; // Skip null values
        return letter.color === "green";
      });
    });

    const accuracy = (correctAttempts.length / attempts.length) * 100 || 0;
    return Math.round(accuracy); // Round to nearest integer
    }
      
  return 0; // Default accuracy if gameVersion is not recognized
}

  getPrecisionForWord(word:string):number|null {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
  
    if (gameVersion === "V2") {
      let totalCorrectLetters = 0;
      let totalIncorrectLetters = 0;
  
      attempts.forEach((attempt) => {
        if('correctLetters' in attempt && 'incorrectLetters' in attempt) {
        totalCorrectLetters += attempt.correctLetters.filter((letter) => letter !== "").length;
        totalIncorrectLetters += attempt.incorrectLetters.length;
        }
      });
  
      const precision = (totalCorrectLetters / (totalCorrectLetters + totalIncorrectLetters)) * 100 || 0;
      return Math.round(precision); // Round to nearest integer
    }
  
    // For v3, precision is not applicable or can be defined differently
    return null; // Or handle v3 logic if needed
  }

  getMistakesForWord(word:string):string[] {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
   
    if (gameVersion === "V2") {
      return attempts.flatMap((attempt) => 'incorrectLetters' in attempt? attempt.incorrectLetters : []);
    } else if (gameVersion === "V3") {
      return attempts
        .filter((attempt) => 
          'categorizedWord' in attempt &&
          Array.isArray(attempt.categorizedWord) &&
          !attempt.categorizedWord.every((letter) => letter?.color === "green"))
        .map((attempt) => ('attemptWord' in attempt? attempt.attemptWord || word : word));
    }
    return [];
  }

  getCorrectLettersForWord(word:string):string[] {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
  
    if (gameVersion === "V2") {
      return attempts.flatMap((attempt) => 
        'correctLetters' in attempt?
        (attempt.correctLetters || []).map((letter) => (letter === "" ? "_" : letter)):
      [])
    }
  
    return []; // Return empty array for v3
  }

  getAllResults() {
      const wordsPlayed = this.getWordsPlayed().map((word) => ({
          word,
          accuracy: this.getAccuracyForWord(word),
          mistakes: this.getMistakesForWord(word),
          attempts: this.getAttemptsForWord(word), // Include all attempts for detailed feedback
          correctLetters: this.getCorrectLettersForWord(word)
      }));

      return { wordsPlayed };
  }

  getAttemptsForWord(word:string):Array<V2Attempt | V3Attempt> {
    return this.attemptsByWord[word] || [];
  }

  getSessionSettings()
  {
    return this.sessionSettings;
  }

  resetStats() {
    this.attemptsByWord = {}; // Clear stats when starting a new game
    console.log("Game stats manager reset");
  }
}

export default GameStatsManager;