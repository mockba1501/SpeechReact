// HangmanBoardV3.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import HangmanBoardV3 from './HangmanBoardV3';
import { GameProvider } from '../../context/GameContext';
import GameContext from '../../context/GameContext';

const mockGameStatsManager = {
    setSessionSettings: vi.fn(),
    logAttempt: vi.fn(),
  };
  
  const mockContext = {
    currentWord: "apple",
    setCurrentWord: vi.fn(),
    clickedKeys: [],
    setClickedKeys: vi.fn(),
    wrongGuesses: 0,
    setWrongGuesses: vi.fn(),
    isGameWon: false,
    setIsGameWon: vi.fn(),
    showModal: false,
    setShowModal: vi.fn(),
    isGameReset: false,
    setIsGameReset: vi.fn(),
    isMicrophoneEnabled: false,
    setIsMicrophoneEnabled: vi.fn(),
    wordIndex: 0,
    setWordIndex: vi.fn(),
    setAllWordsCompleted: vi.fn(),
    gameStatsManager: mockGameStatsManager,
  };
  
describe("HangmanBoardV3", () => {
    it("initializes with the correct game settings", () => {
      render(
        <MemoryRouter>
        <GameProvider value={mockContext}>
          <HangmanBoardV3 settings={{ difficulty: "medium" }} words={[{ word: "apple", hint: "A fruit" }]} />
        </GameProvider>
        </MemoryRouter>
      );
  
      expect(mockGameStatsManager.setSessionSettings).toHaveBeenCalledWith({ difficulty: "medium" });
    });
  
    it("updates the current word when wordIndex changes", () => {
      mockContext.wordIndex = 1;
      render(
        <MemoryRouter>
        <GameProvider value={mockContext}>
          <HangmanBoardV3 settings={{ difficulty: "medium" }} words={[{ word: "banana", hint: "A fruit" }]} />
        </GameProvider>
        </MemoryRouter>
      );
  
      expect(mockContext.setCurrentWord).toHaveBeenCalledWith("banana");
    });
  
    it("toggles microphone mode", () => {
      render(
        <GameContext.Provider value={mockContext}>
          <HangmanBoardV3 settings={{}} words={[]} />
        </GameContext.Provider>
      );
  
      const toggle = screen.getByLabelText("Keyboard On");
      fireEvent.click(toggle);
  
      expect(mockContext.setIsMicrophoneEnabled).toHaveBeenCalledWith(true);
    });
  
    it("displays the correct number of incorrect attempts", () => {
      mockContext.wrongGuesses = 3;
      render(
        <GameContext.Provider value={mockContext}>
          <HangmanBoardV3 settings={{}} words={[]} />
        </GameContext.Provider>
      );
  
      expect(screen.getByText("Incorrect attempts:")).toBeInTheDocument();
      expect(screen.getByText("3 / 6")).toBeInTheDocument();
    });
  
    it("ends the game when wrongGuesses exceed maxGuesses", () => {
      mockContext.wrongGuesses = 6;
  
      render(
        <GameContext.Provider value={mockContext}>
          <HangmanBoardV3 settings={{}} words={[]} />
        </GameContext.Provider>
      );
  
      expect(mockContext.setShowModal).toHaveBeenCalledWith(true);
      expect(mockContext.setIsGameWon).toHaveBeenCalledWith(false);
    });
});