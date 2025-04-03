import { useState, useRef } from 'react';

//Speech Recognition
import { getTokenOrRefresh } from "../token_util";
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

// Special cases sorted alphabetically
const specialCases = {
    "aih": "a",
    "ah": "a",
    "bee": "b",
    "be": "b",
    "sea": "c",
    "see": "c",
    "dee": "d",
    "ee": "e",
    "eee": "e",
    "if": "f",
    "eff": "f",
    "gee": "g",
    "he": "h",
    "aitch": "h",
    "itch": "h",
    "eye": "i",
    "ay": "i",
    "jay": "j",
    "kay": "k",
    "okay": "k",
    "ok": "k",
    "el": "l",
    "em": "m",
    "en": "n",
    "oh": "o",
    "ohh": "o",
    "pee": "p",
    "cue": "q",
    "queue": "q",
    "are": "r",
    "ar": "r",
    "arr": "r",
    "or": "r",
    "air": "r",
    "ess": "s",
    "es": "s",
    "ss": "s",
    "tee": "t",
    "tea": "t",
    "vee": "v",
    "you": "u",
    "yu": "u",
    "ewe": "u",
    "double you": "w",
    "ex": "x",
    "why": "y",
    "zee": "z",
    "zed": "z",
};

const getRecognizedLetter = (text) => {
    console.log("Cleaning ", text); 
    // Convert to lowercase and remove non-alphabetic characters
    let cleanedText = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();

    if (cleanedText.length === 1)
    {
        console.log("Single letter detected: ", cleanedText);
        return cleanedText; // Return the letter if it's a single character
    }

    // Check if the cleaned text is a special case
    if (specialCases[cleanedText]) {
        return specialCases[cleanedText];
    }
    
    // If no special case matches, extract the first valid letter
    const firstLetter = cleanedText.match(/[a-z]/)?.[0];
    console.log("No match found for ", cleanedText, " returning ", firstLetter);
    return firstLetter || null; // Return null if no valid letter is found
};

const checkMicrophonePermission = async () => {
    try {
        // Check microphone permissions
        const micPermission = await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => true)
        .catch(() => false);

        if (!micPermission) {
            console.error("Microphone access denied or unavailable.");
            setError("Microphone access denied. Please allow access in browser settings.");
            setIsListening(false);
            return;
        }

    } catch(error)
    {
        setIsListening(false);
        setError(error.message);
    }
    return true;
}

const getMicrosoftRecognizer = async () => {
    try {    
        // Check if the recognizer is already initialized
        const tokenObj = await getTokenOrRefresh();
        console.log(tokenObj);
        if (!tokenObj.authToken) {
            alert("Voice features are still initializing. Please try again in a moment.");
            console.error("Authorization token is null or undefined");
            throw new Error("Authorization token is null or undefined");
        }

        //Microsoft Speech SDK Configuration
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        
        // Use the custom model endpoint
        const speechEndPoint = import.meta.env.VITE_APP_SPEECH_ENDPOINT;
        speechConfig.endpointId = speechEndPoint;
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        
        //Microsoft Speech Recognizer
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        //Boost accuracy for individual letters
        const phraseList = speechsdk.PhraseListGrammar.fromRecognizer(recognizer);
        const letters = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
        letters.forEach(letter => phraseList.addPhrase(letter));

        return recognizer;
    } catch (error) {
        console.error("Error initializing Microsoft Recognizer:", error);
        throw error;  // Re-throw so calling functions can handle it
    }
}

const useVoiceRecognition = () => {
    const [recognizedText, setRecognizedText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognizerRef = useRef(null);

    // Activate microphone for speech recognition
    const startListening = async () => {
        // Set listening state and reset error
        setIsListening(true);
        setError(null);

        checkMicrophonePermission();

        // Get Microsoft recognizer
        const recognizer = await getMicrosoftRecognizer();
        if (recognizer) {
            recognizerRef.current = recognizer;
        }
        else {
            setIsListening(false);
            setError("Recognizer is not available. Please try again.");
            return;
        }

        const msPromise = new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(result => {
                setIsListening(false);
                
                if (!result) {
                    console.error("🔴 Microsoft Recognizer returned an empty result");
                    recognizer.close();
                    reject(new Error("Microsoft Recognizer failed"));
                    return;
                }

                const confidence = result.reason === ResultReason.RecognizedSpeech ? 0.9 : 0.5; // Default confidence
                console.log("🔵 Microsoft Recognizer Received:", result.text," confidence ", confidence);

                resolve({
                    text: result.text || "",
                    confidence: confidence,
                    source: 'microsoft'
                });

                recognizer.close(); // Close the recognizer after use
            }, err => {
                console.error("🔴 Microsoft Recognizer Error:", err);
                recognizer.close();
                reject(err);
            });
        });

        const webSpeechPromise = new Promise((resolve, reject) => {
            let promiseSettled = false; // Flag to track if the promise has been settled

            const resolveOnce = (value) => {
                if(!promiseSettled) {
                    promiseSettled = true;
                    resolve(value);
                }
            };

            const rejectOnce = (error) => {
                if (!promiseSettled) {
                    promiseSettled = true;
                    reject(error);
                }
            };

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.continuous = false; // Keep false for single utterances
            recognition.interimResults = false;
            recognition.maxAlternatives = 5;
            
            let timeoutId = setTimeout(() => {
                console.warn("🟡 Web Speech Timeout No response detected.");
                recognition.stop();
                //rejectOnce(new Error("Web Speech API timeout"));
                resolveOnce([{ text: "", confidence: 0, source: 'web-speech', error: "timeout" }]);
            }, 5000); // Ensure a timeout in case of no speech detection

            recognition.onstart = () => console.log("🟢 Web Speech API Started");

            recognition.onresult = (event) => {
                clearTimeout(timeoutId); // Prevent timeout if we get a result
                const results = [];
                for (let i = 0; i < event.results[0].length; i++) {
                    let transcript = event.results[0][i].transcript;
                    let confidence = event.results[0][i].confidence;
                    console.log("🟢 Web Speech Recognizer Received:", transcript, " confidence ", confidence);
                    results.push({
                        text: transcript,
                        confidence: confidence,
                        source: 'web-speech'
                    });
                }
                resolveOnce(results.length > 0 ? results : [{ text: "", confidence: 0, source: 'web-speech' }]);
            };

            recognition.onsoundstart = () => console.log("🟡 Web Speech - detected sound");
            recognition.onspeechstart = () => console.log("🟡 Web Speech - detected speech");

            recognition.onerror = (event) => {
                clearTimeout(timeoutId); 
                console.error("🔴 Web Speech API Error:", event.error);
                resolveOnce({
                    text: "",
                    confidence: 0,
                    source: 'web-speech',
                    error: event.error
                });
            };

            recognition.onend = () => {
                clearTimeout(timeoutId);
                console.log("🟢 Web Speech API Ended");

                // Add this: Resolve with empty result if not already resolved/rejected
                if (!promiseSettled) {
                    console.warn("🟠 Web Speech ended without result or error");
                    resolveOnce([{ text: "", confidence: 0, source: 'web-speech', error: "no-result" }]);
                }
            }

            recognition.start();
        });

    // Wait for both promises (Microsoft & Web Speech) to finish
    const results = await Promise.allSettled([msPromise, webSpeechPromise])
    .then(promiseResults => {
        console.log("Promise Results: ", promiseResults);
        return promiseResults.map(result => {
            if(result.status === 'fulfilled')
                return result.value;
            else {
                console.warn("❌ Promise rejected:", result.reason);
                return null; // Handle rejected promises gracefully
            } 
        })
    });

    console.log("Results from both recognizers: ", results);
    //const finalResult = selectBestResult(results);
    const finalResult = getAllBestResults(results);

    if (!finalResult) {
        console.error("❌ Error: No valid match found! Returning fallback.");
        //return "_";  // Return a safe fallback instead of an empty value
    }
    console.log("Final Result: ", finalResult);
    setRecognizedText(finalResult);
    };

    const getAllBestResults = (results) => {
        console.log("Raw results from recognizers:", results);
        const [msResult, webResults] = results;
        const allValidResults = [];
    
        // Helper function to clean and validate a result
        const processResult = (text, confidence, source) => {
            const cleanedLetter = getRecognizedLetter(text); // Your existing cleaning function
            if (!cleanedLetter || cleanedLetter.trim() === "") {
                console.log(`Ignoring invalid result: "${text}" (from ${source})`);
                return null;
            }
            return {
                original: text,       // Original recognized text (e.g., "A B C")
                letter: cleanedLetter, // Cleaned single letter (e.g., "A")
                confidence: confidence || 0.5,
                source: source        // 'microsoft' or 'web-speech'
            };
        };
    
        // Process Microsoft result (if exists)
        if (msResult?.text) {
            const processed = processResult(
                msResult.text,
                msResult.confidence,
                'microsoft'
            );
            if (processed) allValidResults.push(processed);
        }
    
        // Process Web Speech results (force array format)
        const webResultsArray = Array.isArray(webResults) ? webResults : [webResults];
        webResultsArray.forEach(result => {
            if (result?.text) {
                const processed = processResult(
                    result.text,
                    result.confidence,
                    'web-speech'
                );
                if (processed) allValidResults.push(processed);
            }
        });
    
        console.log("All valid results:", allValidResults);
        return allValidResults.length > 0 ? allValidResults : [];
    };

    const selectBestResult = (results) => {
        console.log("Comparing Results ...", results);
        const [msResult, webResults] = results;
        const allResults = []

        if(msResult?.text){
            allResults.push({ 
                text: msResult.text, 
                confidence: msResult.reason === ResultReason.RecognizedSpeech ? 0.9 : 0.5,
                source: 'microsoft'
            });
        }
         
        // Ensure webResults is always an array
        const webResultsArray = Array.isArray(webResults) ? webResults : [webResults];
        webResultsArray.forEach(result => {
            if (result.text !== null && result.text !== "") {
                allResults.push({
                    text: result.text,
                    confidence: result.confidence || 0.5,
                    source: 'web-speech'
                });
            }
        });
        
        console.log("All Results: ", allResults);
        // If no valid results exist, return an empty string to prevent hanging
        if (allResults.length === 0) {
            console.warn("No valid results from both recognizers");
            return '';
        }

        // Filter out empty results
        const validResults = allResults.filter(r => r.text && r.text.trim());
        
        if (validResults.length === 0) return ''; // No valid speech detected

        // Process and prioritize results
        const processedResults = validResults.map(result => {
            const letter = getRecognizedLetter(result.text);

            // If we get a single letter, return it immediately
            if (/^[a-z]$/.test(letter)) {
                console.log("✅ Recognized single letter:", letter, "from", result.source);
                return letter;
            }

            return {
                original: result.text,
                letter,
                confidence: result.source === 'microsoft' ? 1 : result.confidence, // Microsoft is always trusted
                source: result.source
            };
        });

        
        // If a direct letter match was already returned, we don’t need to continue
        if (typeof processedResults === 'string') return processedResults;

        // If a direct letter match was found, return it
        const singleLetterMatch = processedResults.find(res => /^[a-z]$/.test(res.letter));
        if (singleLetterMatch) {
            console.log("Single letter match found:", singleLetterMatch.letter);
            return singleLetterMatch.letter;
        }

        // Sort by confidence (Microsoft always prioritized)
        processedResults.sort((a, b) => b.confidence - a.confidence);
        console.log("Sorted Results: ", processedResults);
        return processedResults[0].letter || '';
    };

    // Cancel recognition
    const stopListening = () => {
        if (!isListening || !recognizedText) return; // No need to stop if we're not listening

        if (isListening && recognizerRef.current) {
            recognizerRef.current.close(); // Immediately stops the recognition process
            setIsListening(false);
            recognizerRef.current = null; // Clear the ref
        };
    }

    return {recognizedText, isListening, error, startListening, stopListening};
}

export default useVoiceRecognition;