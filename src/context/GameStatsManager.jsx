class GameStatsManager {
  constructor() {
    this.attemptsByWord = {}; // Store attempts grouped by word
    this.sessionSettings = {}; //Store the game session setting
  }

  //Start game session function (Responsible for logging Settings, selectedWords, startTime, finishTime)
  setSessionSettings(currentSettings,gameVersion)
  {
    console.log("Game session started:", currentSettings, "Version:", gameVersion);
    this.sessionSettings = {...currentSettings, gameVersion};
  }

  logAttempt({ recognitionMode, currentWord, attemptWord = null, categorizedWord = null, clickedKey = null, isCorrect = false }) {
    const { gameVersion } = this.sessionSettings;

    if (gameVersion === "v2" && (categorizedWord || attemptWord) ) {
        throw new Error("V2 does not use categorizedWord or attemptWord");
    }

    if (gameVersion === "v3" && (clickedKey || isCorrect)) {
        throw new Error("V3 does not use clickedKey or isCorrect");
    }

    if (!this.attemptsByWord[currentWord]) {
      this.attemptsByWord[currentWord] = [];
    }

    const attemptInfo = {
      recognitionMode,
      gameVersion,
      timestamp: Date.now(),
      //...(gameVersion === "v2" && { clickedKey, isCorrect }),
      //...(gameVersion === "v3" && { attemptWord, categorizedWord }),
    };

    if (gameVersion === "v2") {
      attemptInfo.clickedKey = clickedKey;
      attemptInfo.isCorrect = isCorrect;
    } else if (gameVersion === "v3") {
        attemptInfo.attemptWord = attemptWord;
        attemptInfo.categorizedWord = categorizedWord ?? [];
    }

    this.attemptsByWord[currentWord].push(attemptInfo);
  }

  logFinishAttempt(currentWord, correctLetters, incorrectLetters)
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
  
  getTotalMistakes() {
    const { gameVersion } = this.sessionSettings;
    let totalMistakes = 0;

    for (const word in this.attemptsByWord) {
      const attempts = this.attemptsByWord[word];
      let hasCorrectAttempt = false;
      
      // Count how many attempts were made before getting the correct word
      for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];

        if (gameVersion === "v2") {
          //const isCorrect = attempt.correctLetters.length === word.length && attempt.incorrectLetters.length === 0;
          //if (isCorrect) {// Mistakes = number of wrong attempts before this
            totalMistakes += attempt.incorrectLetters.length; 
            //hasCorrectAttempt = true;
            //break;
        } else if (gameVersion === "v3") {
          const isCorrect = attempt.categorizedWord.every(l => l.color === "green");
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

  getWordsPlayed() {
      return Object.keys(this.attemptsByWord);
  }

  getAccuracyForWord(word) {
    const { gameVersion } = this.sessionSettings;
    const attempts = this.getAttemptsForWord(word);

    if (attempts.length === 0) return 0; // Prevent errors when no attempts exist
    
    if (gameVersion === "v2") {
      // For v2, use the last attempt (final state of the word)
      const lastAttempt = attempts[attempts.length - 1];
      if (!lastAttempt) return 0;
  
      const totalLetters = word.length;
      const correctLetters = lastAttempt.correctLetters.filter((letter) => letter !== "").length;
      const accuracy = (correctLetters / totalLetters) * 100 || 0;
      return Math.round(accuracy); // Round to nearest integer
    } else if (gameVersion === "v3") {
      // For v3, calculate accuracy based on correct attempts
      const correctAttempts = attempts.filter((attempt) => {
      
        // Ensure categorizedWord is defined and is an array
      if (!attempt.categorizedWord || !Array.isArray(attempt.categorizedWord)) {
        return false; // Skip this attempt if categorizedWord is invalid
      }
      
      // Check if all non-null letters are green
      return attempt.categorizedWord.every((letter) => {
        if (letter === null) return true; // Skip null values
        return letter.color === "green";
      });
    });

    const accuracy = (correctAttempts.length / attempts.length) * 100 || 0;
    return Math.round(accuracy); // Round to nearest integer
    }
      
  return 0; // Default accuracy if gameVersion is not recognized
}

  getPrecisionForWord(word) {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
  
    if (gameVersion === "v2") {
      let totalCorrectLetters = 0;
      let totalIncorrectLetters = 0;
  
      attempts.forEach((attempt) => {
        totalCorrectLetters += attempt.correctLetters.filter((letter) => letter !== "").length;
        totalIncorrectLetters += attempt.incorrectLetters.length;
      });
  
      const precision = (totalCorrectLetters / (totalCorrectLetters + totalIncorrectLetters)) * 100 || 0;
      return Math.round(precision); // Round to nearest integer
    }
  
    // For v3, precision is not applicable or can be defined differently
    return null; // Or handle v3 logic if needed
  }

  getMistakesForWord(word) {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
   
    if (gameVersion === "v2") {
      return attempts.flatMap((attempt) => attempt.incorrectLetters || []);
    } else if (gameVersion === "v3") {
      return attempts
        .filter((attempt) => !attempt.categorizedWord.every((letter) => letter.color === "green"))
        .map((attempt) => attempt.attemptWord || word);
    }
    return [];
  }

  getCorrectLettersForWord(word) {
    const attempts = this.getAttemptsForWord(word);
    const { gameVersion } = this.sessionSettings;
  
    if (gameVersion === "v2") {
      return attempts.flatMap((attempt) => 
        (attempt.correctLetters || []).map((letter) => (letter === "" ? "_" : letter)))
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

  getAttemptsForWord(word) {
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