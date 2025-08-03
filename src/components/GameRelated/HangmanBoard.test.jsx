// HangmanBoard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import HangmanBoard from './HangmanBoard';
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
  
describe("HangmanBoard", () => {
    it("initializes with the correct game settings", async () => {
      render(
        <MemoryRouter>
        <GameProvider value={mockContext}>
          <HangmanBoard settings={{ difficulty: "medium" }} words={[{ word: "apple", hint: "A fruit" }]} />
        </GameProvider>
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(mockGameStatsManager.setSessionSettings).toHaveBeenCalledWith({
          difficulty: "medium",
        });
      });
    });
  
    it("updates the current word when wordIndex changes", async() => {
        const updatedContext = {
            ...mockContext,
            wordIndex: 1,
          };
          
      render(
        <MemoryRouter>
        <GameProvider value={updatedContext}>
          <HangmanBoard settings={{ difficulty: "medium" }} words={[{ word: "banana", hint: "A fruit" }]} />
        </GameProvider>
        </MemoryRouter>
      );
  
      await waitFor(() => {
        expect(updatedContext.setCurrentWord).toHaveBeenCalledWith("banana");
      });
    });
  
    it("toggles microphone mode", () => {
      render(
        <GameContext.Provider value={mockContext}>
          <HangmanBoard settings={{}} words={[]} />
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
          <HangmanBoard settings={{}} words={[]} />
        </GameContext.Provider>
      );
  
      expect(screen.getByText("Incorrect attempts:")).toBeInTheDocument();
      expect(screen.getByText("3 / 6")).toBeInTheDocument();
    });
  
    it("ends the game when wrongGuesses exceed maxGuesses", async() => {
      // Update the context with wrongGuesses exceeding maxGuesses
  const updatedContext = {
    ...mockContext,
    wrongGuesses: 6, // maxGuesses is 6
  };
    //    mockContext.wrongGuesses = 6;
  
      render(
        <GameContext.Provider value={updatedContext}>
          <HangmanBoard settings={{}} words={[]} />
        </GameContext.Provider>
      );
  
      // Wait for the game-over logic to run
  await waitFor(() => {
    expect(updatedContext.setShowModal).toHaveBeenCalledWith(true);
    expect(updatedContext.setIsGameWon).toHaveBeenCalledWith(false);
  });
});
});