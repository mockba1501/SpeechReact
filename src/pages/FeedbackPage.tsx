import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GameContext from "../context/GameContext";

//Styling
import { Box, Button, Typography, List, ListItem, ListItemText } from "@mui/material";

const FeedbackPage = () => {
    const {
        gameStatsManager,
        resetGameBoard,
    } = useContext(GameContext);
    
    // Define V3Attempt type locally
    type V3Attempt = {
        timestamp: number;
        recognitionMode: string;
        attemptWord: string;
        categorizedWord: Array<{ letter?: string; color?: string }>;
    };
    
    type WordData = {
        word: string;
        accuracy: number;
        mistakes: string[];
        attempts: V3Attempt[];
        correctLetters: string[];
    };
    
    type Results = {
        wordsPlayed: WordData[];
    };
    
    const [results, setResults] = useState<Results | null>(null);
    // Define SessionSettings type if not already imported
    type SessionSettings = {
        sound?: string;
        position?: string;
        difficulty?: string;
        age?: string;
        // Add other properties as needed
    };
    
    const [settings, setSettings] = useState<SessionSettings | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const handleBackNavigation = (event:PopStateEvent) => {
          resetGameBoard();
          handlePlayAgain();
        }
  
        window.addEventListener("popstate", handleBackNavigation);
        return () => {
          window.removeEventListener("popstate", handleBackNavigation);
        }
      }, []);

    // Save to local storage or context
    useEffect(() => {
        const results = gameStatsManager.getAllResults();
        console.log("FeedbackPage results:", results);
        
        // Filter and cast to V3 attempts only
        const filteredResults = {
            wordsPlayed: results.wordsPlayed.map(word => ({
                ...word,
                attempts: word.attempts.filter(attempt => 
                    'categorizedWord' in attempt && 'attemptWord' in attempt
                ) as V3Attempt[]
            }))
        };
        
        setResults(filteredResults);

        const sessionSettings = gameStatsManager.getSessionSettings();
        console.log("FeedbackPage sessionSettings:", sessionSettings);
        setSettings(sessionSettings);
    }, [gameStatsManager]);

    const handlePlayAgain = () =>{
        gameStatsManager.resetStats();
        navigate("/");
    }
    if (!results) return <p>Loading feedback...</p>;

    return (
        <div className="flex flex-col items-center">
            {/* White container for feedback */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 5,
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 600,
                    minWidth: 400,
                    width: "70%",
                    textAlign: "center",
                    overflow: "hidden", // Prevents content from escaping the box
                    wordWrap: "break-word", // Ensures long words wrap
                }}
            >
                <Typography variant="h4" fontWeight="bold" mb={2}>
                    Game Feedback
                </Typography>

                {results.wordsPlayed.length === 0 ? (
                    <Typography color="gray" mt={2}>No words played yet.</Typography>
                ) : (
                <List sx={{ width: "100%" }}>
                    <h2>
                        Great job! You practiced <b>{results.wordsPlayed.length} word{results.wordsPlayed.length > 1 ? "s " : " "}</b>
                        {settings ? (
                            <>
                                with the sound <b>{'"'}{settings.sound}{'"'}</b> in the <b>{settings.position} of the word</b>. Keep up the good work!
                            </>
                        ) : (
                            <>Keep up the good work!</>
                        )}
                    </h2>
                    {results.wordsPlayed.map((wordData, index) => (
                        <details key={index} style={{ width: "100%", borderBottom: "1px solid #ddd", padding: "8px 0" }} open={index === 0}>
                            <summary style={{ cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                                <span style={{ marginRight: 8, transition: "transform 0.3s"}}>
                                    ▶️
                                </span>
                                {wordData.word} - Accuracy: {wordData.accuracy}%
                            </summary>
                        
                            {/* Show all attempts */}
                            <List sx={{ paddingLeft: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "8px", marginTop: "4px" }}>
                                {wordData.attempts.map((attempt, attemptIndex) => (
                                    <ListItem key={attemptIndex} sx={{ display: "block" }}>
                                        <h3 style={{ margin: 0, marginRight: "16px", flexShrink: 0 }}>
                                            <b>Attempt {attemptIndex + 1}:</b>
                                        </h3>
                                        <ListItemText
                                            primary={attempt.categorizedWord.map((mistake: { letter?: string; color?: string }, i: number) => (
                                                <span key={i} style={{ color: mistake?.color || "gray", marginRight: 4 }}>
                                                    <b>{mistake?.letter || "_"}</b>
                                                </span>
                                            ))}
                                            secondary={
                                                <span>
                                                    <b>Mode:</b> {attempt.recognitionMode}, <b>Timestamp:</b> {new Date(attempt.timestamp).toLocaleTimeString()}
                                                </span>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </details>
                    ))}
                    </List>
                )}
                {/* Replay Button */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={handlePlayAgain}
                >
                    Play Again
                </Button>
            </Box>
        </div>
    );
};

export default FeedbackPage;
