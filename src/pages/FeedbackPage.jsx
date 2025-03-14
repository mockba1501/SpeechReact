import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GameContext from "../context/GameContext";

//Styling
import Box from '@mui/material/Box';
import { Button, Typography, List, ListItem, ListItemText } from "@mui/material";

const FeedbackPage = () => {
    const {
        gameStatsManager
    } = useContext(GameContext);
    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    
    // Save to local storage or context
    useEffect(() => {
        const results = gameStatsManager.getAllResults();
        console.log("Triggering game stats", results)
        localStorage.setItem("gameResults", JSON.stringify(results));
        setResults(results);
    }, [gameStatsManager]);


    useEffect(() => {
        const storedResults = localStorage.getItem("gameResults");
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

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
                    width: "50%",
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" fontWeight="bold" mb={2}>
                    Game Feedback
                </Typography>

                {results.wordsPlayed.length === 0 ? (
                    <Typography color="gray" mt={2}>No words played yet.</Typography>
                ) : (
                <List sx={{ width: "100%" }}>
                    
                    {results.wordsPlayed.map((wordData, index) => (
                        <ListItem key={index} sx={{ padding: 2, borderBottom: "1px solid #ddd" }}>
                            <details style={{ width: "100%" }} open>
                                <summary style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                                    <Typography fontWeight="bold">{wordData.word}</Typography>
                                    <Typography color={"blue"}>{wordData.accuracy}%</Typography>
                                </summary>
                                <List sx={{ paddingLeft: 2, marginTop: 1 }}>
                                    {wordData.attempts.map((attempt, attemptIndex) => (
                                        <ListItem key={attemptIndex} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Typography>
                                                Attempt {attemptIndex + 1}:
                                            </Typography>
                                            <Typography>
                                                
                                                {attempt.categorizedWord.map((mistake, i) => {
                                                    if (!mistake) {
                                                        return <span key={i} style={{ color: "red", marginRight: 4 }}><b>_</b></span>;
                                                    }
                                                    return (
                                                        <span key={i} style={{ color: mistake.color || "gray", marginRight: 4 }}>
                                                            <b>{mistake.letter}</b>
                                                        </span>
                                                    );
                                                })}
                                            </Typography>
                                        </ListItem>
                                    ))}
                                </List>
                            </details>
                        </ListItem>
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
