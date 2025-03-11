import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Styling
import Box from '@mui/material/Box';
import { Button, Typography, List, ListItem } from "@mui/material";

const FeedbackPage = () => {
    const [results, setResults] = useState(null);
    const navigate = useNavigate();
    
    const gameResults = {
        wordsPlayed: [
            { word: "Rabbit", accuracy: 85, mistakes: ["R mispronounced"] },
            { word: "Cat", accuracy: 95, mistakes: [] },
            { word: "Dog", accuracy: 70, mistakes: ["D sounded unclear"] }
        ]
    };
    
    // Save to local storage or context
    localStorage.setItem("gameResults", JSON.stringify(gameResults));

        
    useEffect(() => {
        const storedResults = localStorage.getItem("gameResults");
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

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

                {/* Word results */}
                <List sx={{ width: "100%" }}>
                    {results.wordsPlayed.map((wordData, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: 2,
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <Typography fontWeight="bold">{wordData.word}</Typography>
                            <Typography 
                                color={wordData.accuracy > 85 ? "green" : "red"}
                            >
                                {wordData.accuracy}%
                            </Typography>
                        </ListItem>
                    ))}
                </List>

                {/* Error insights */}
                <Typography variant="h6" mt={3}>
                    Error Insights:
                </Typography>
                <Box sx={{ textAlign: "left", mt: 1 }}>
                    {results.wordsPlayed.map((wordData, index) => (
                        wordData.mistakes.length > 0 ? (
                            <Typography key={index} color="red">
                                {wordData.word}: {wordData.mistakes.join(", ")}
                            </Typography>
                        ) : null
                    ))}
                </Box>

                {/* Replay Button */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                    onClick={() => navigate("/")}
                >
                    Play Again
                </Button>
            </Box>
        </div>
    );
};

export default FeedbackPage;
