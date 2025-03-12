class GameStatsManager {
    constructor() {
      this.attemptsByWord = {}; // Store attempts grouped by word
      //I need to store the passed game setting (session settings)
    }
  
    //Start game session function (Responsible for logging Settings, selectedWords, startTime, finishTime)

    logAttempt({ currentWord, attemptWord, categorizedWord, recognitionMode }) {
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
  
        // Count how many attempts were made before getting the correct word
        for (let i = 0; i < attempts.length; i++) {
          const categorized = attempts[i].categorizedWord;
          const isCorrect = categorized.every(l => l.status === "correct");
  
          if (isCorrect) {
            totalMistakes += i; // Mistakes = number of wrong attempts before this
            break; // Stop counting for this word
          }
        }
      }
  
      return totalMistakes;
    }
  
    getAttemptsForWord(word) {
      return this.attemptsByWord[word] || [];
    }
  
    resetStats() {
      this.attemptsByWord = {}; // Clear stats when starting a new game
    }
  }
  
export default GameStatsManager;
  