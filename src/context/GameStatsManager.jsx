class GameStatsManager {
    constructor() {
      this.attemptsByWord = {}; // Store attempts grouped by word
      this.sessionSettings = {}; //Store the game session setting
    }
  
    //Start game session function (Responsible for logging Settings, selectedWords, startTime, finishTime)
    setSessionSettings(currentSettings)
    {
      console.log(currentSettings);
      this.sessionSettings = currentSettings;
    }

    logAttempt({ currentWord, attemptWord, categorizedWord, recognitionMode }) {
        console.log("Logging attempt ", currentWord, attemptWord, categorizedWord, recognitionMode);
      if (!this.attemptsByWord[currentWord]) {
        this.attemptsByWord[currentWord] = [];
      }
  
      const attemptInfo = {
        attemptWord,
        categorizedWord,
        recognitionMode,
        timestamp: Date.now(),
      };
  
      this.attemptsByWord[currentWord].push(attemptInfo);
    }
  
    getTotalMistakes() {
      let totalMistakes = 0;
  
      for (const word in this.attemptsByWord) {
        const attempts = this.attemptsByWord[word];
        let hasCorrectAttempt = false;
        
        // Count how many attempts were made before getting the correct word
        for (let i = 0; i < attempts.length; i++) {
          const categorized = attempts[i].categorizedWord;
          const isCorrect = categorized.every(l => l.color === "green");
          
          if (isCorrect) {
            totalMistakes += i; // Mistakes = number of wrong attempts before this
            hasCorrectAttempt = true;
            break; // Stop counting for this word
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
        const attempts = this.getAttemptsForWord(word);
        const correctAttempts = attempts.filter((attempt) =>
            attempt.categorizedWord.every((letter) => letter.color === "green")
        );
        const accuracy = (correctAttempts.length / attempts.length) * 100 || 0;
        return Math.round(accuracy); // Round to nearest integer
    }

    getMistakesForWord(word) {
        const attempts = this.getAttemptsForWord(word);
        return attempts
            .filter((attempt) => !attempt.categorizedWord.every((letter) => letter.color === "green"))
            .map((attempt) => attempt.attemptWord);
    }

    getAllResults() {
        const wordsPlayed = this.getWordsPlayed().map((word) => ({
            word,
            accuracy: this.getAccuracyForWord(word),
            mistakes: this.getMistakesForWord(word),
            attempts: this.getAttemptsForWord(word), // Include all attempts for detailed feedback
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
    }
  }
  
export default GameStatsManager;
  