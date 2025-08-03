interface SessionSettings {
  [key: string]: any;
}

interface BaseAttempt {
  recognitionMode?: string;
  timestamp: number;
}

interface V3Attempt extends BaseAttempt {
  attemptWord?: string;
  categorizedWord?: Array<{color: "green" | "yellow" | "red"} | null>
}

class GameStatsManager {
  private attemptsByWord: Record<string, Array<V3Attempt>>;
  private sessionSettings: SessionSettings;

  constructor() {
    this.attemptsByWord = {}; // Store attempts grouped by word
    this.sessionSettings = {}; //Store the game session setting
  }

  //Start game session function (Responsible for logging Settings, selectedWords, startTime, finishTime)
  setSessionSettings(currentSettings:Record<string,any>):void
  {
    console.log("Game session started:", currentSettings);
    this.sessionSettings = {...currentSettings};
  }

  logAttempt(params:{ 
    recognitionMode:string, 
    currentWord:string, 
    attemptWord?:string|null, 
    categorizedWord?:Array<{color: "green" | "yellow" | "red"} | null> }):void {
    
    const {recognitionMode, currentWord, attemptWord, categorizedWord} = params;
    
    if (!this.attemptsByWord[currentWord]) {
      this.attemptsByWord[currentWord] = [];
    }

    const attemptInfo: V3Attempt = {
      recognitionMode,
      timestamp: Date.now(),
      attemptWord: attemptWord || "",
      categorizedWord: categorizedWord ?? []
    };

    this.attemptsByWord[currentWord].push(attemptInfo);
  }

  
  getTotalMistakes():number {
    let totalMistakes = 0;

    for (const word in this.attemptsByWord) {
      const attempts = this.attemptsByWord[word];
      let hasCorrectAttempt = false;
      
      // Count how many attempts were made before getting the correct word
      for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];

        if (attempt.categorizedWord && Array.isArray(attempt.categorizedWord)) {
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
    const attempts = this.getAttemptsForWord(word);

    if (attempts.length === 0) return 0; // Prevent errors when no attempts exist
    
    // Calculate accuracy based on correct attempts
    const correctAttempts = attempts.filter((attempt) => {
      return attempt.categorizedWord && 
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

  getPrecisionForWord(word:string):number|null {
    // Precision is not applicable for V3 (full-word recognition)
    return null;
  }

  getMistakesForWord(word:string):string[] {
    const attempts = this.getAttemptsForWord(word);
   
    // For V3, return incorrect attempts (attempted words that weren't fully correct)
    return attempts
      .filter((attempt) => 
        attempt.categorizedWord &&
        Array.isArray(attempt.categorizedWord) &&
        !attempt.categorizedWord.every((letter) => letter?.color === "green"))
      .map((attempt) => attempt.attemptWord || word);
  }

  getCorrectLettersForWord(word:string):string[] {
    // For V3, correct letters concept doesn't apply (full-word recognition)
    // Return empty array or the full word if completed successfully
    const attempts = this.getAttemptsForWord(word);
    const correctAttempt = attempts.find((attempt) => 
      attempt.categorizedWord &&
      Array.isArray(attempt.categorizedWord) &&
      attempt.categorizedWord.every((letter) => letter?.color === "green")
    );
    
    return correctAttempt ? [word] : [];
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

  getAttemptsForWord(word:string):Array<V3Attempt> {
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