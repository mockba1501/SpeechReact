import { useState, useRef } from 'react';

//Speech Recognition
import { getTokenOrRefresh } from "../token_util";
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const cleanRecognizedText = (text) => {
    console.log("Cleaning ", text); 
    // Normalize the text: lowercase and trim whitespace
    const normalizedText = text.trim().toLowerCase();

    // Special cases sorted alphabetically
    const specialCases = {
        "ay": "a",
        "bee": "b",
        "be": "b",
        "sea": "c",
        "see": "c",
        "dee": "d",
        "eff": "f",
        "gee": "g",
        "he": "h",
        "aitch": "h",
        "itch": "h",
        "eye": "i",
        "Ay": "i",
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

    // Check if the normalized text matches any special case - this is an extra step although it is supposed to be done in the server side
    for (const [word, letter] of Object.entries(specialCases)) {
        if (normalizedText.includes(word)) {
            return letter;
        }
    }

    // If no special case matches, extract the first valid letter
    const firstLetter = normalizedText.match(/[a-z]/)?.[0];
    console.log("No match found for ", normalizedText, " returning ", firstLetter);
    return firstLetter || null; // Return null if no valid letter is found
};

const useVoiceRecognition = () => {
    const [recognizedText, setRecognizedText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognizerRef = useRef(null);

    // Activate microphone for speech recognition
    const startListening = async () => {
        setIsListening(true);
        setError(null);

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

        const tokenObj = await getTokenOrRefresh();
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
        //speechConfig.endpointId = speechEndPoint;
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        
        //Microsoft Speech Recognizer
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
        recognizerRef.current = recognizer;

        // 🔤 Boost accuracy for individual letters
        const phraseList = speechsdk.PhraseListGrammar.fromRecognizer(recognizer);
        const letters = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");
        letters.forEach(letter => phraseList.addPhrase(letter));
/*
        const msPromise = new Promise((resolve) => {
        recognizer.recognizeOnceAsync(result => {
            
            console.log("Microsoft speech listening....");
            /*
            if (result.reason === ResultReason.RecognizedSpeech) {
                //const spokenLetter = result.text.trim().toLowerCase();
                const spokenLetter = cleanRecognizedText(result.text);
                console.log("Detected ",spokenLetter);
                if (spokenLetter) {
                    setRecognizedText(spokenLetter);
                }
            } else {
                console.error("Speech recognition failed or was canceled.");
                setError("Speech recognition failed or was canceled.")
            }
            */

            /*
            recognizer.close();
            //resolve(result.text);
            resolve(result.reason === ResultReason.RecognizedSpeech ? result.text : "");
            console.log("Microsoft " , result.text);
        });
    });
    // Web Speech API Recognizer
    const webSpeechPromise = new Promise((resolve) => {
        console.log("Web Speech listening....");
        if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            resolve("");
            return;
        }
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
            let result = event.results[0][0].transcript;
            console.log("Web Speech ", result);
            resolve(result);
        };
        recognition.onerror = () => resolve("");
        recognition.onend = () => recognition.stop();
        recognition.start();
    });
*/
        const msPromise = new Promise((resolve) => {
            recognizer.recognizeOnceAsync(result => {
                setIsListening(false);
                
                const confidence = result.reason === ResultReason.RecognizedSpeech ? 0.9 : 0.5; // Default confidence
                /*
                const confidence = result.constructor.name === 'SpeechRecognitionResult' ? 
                    result.confidence : 
                    null; // Microsoft doesn't provide direct confidence scores
                */
                console.log("🔵 Microsoft Recognizer Received:", result.text," confidence ", result);
                recognizer.close();
                resolve({
                    text: result.text || "",
                    confidence: confidence,
                    source: 'microsoft'
                });
                //recognizer.close();
                //resolve(result.text || "");  // Ensure it resolves even if empty
            });
        });

        const webSpeechPromise = new Promise((resolve) => {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.continuous = false; // Keep false for single utterances
            recognition.interimResults = false;
            recognition.maxAlternatives = 5;
            // Adjust these based on your needs:
            recognition.speechTimeout = 3000; // Wait longer for speech to start
            recognition.noSpeechTimeout = 5000; // Wait longer before giving up

            recognition.onstart = () => console.log("🟢 Web Speech API Started");

            recognition.onresult = (event) => {
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
                resolve(results.length > 0 ? results : [{ text: "", confidence: 0, source: 'web-speech' }]);
                
            // console.log("🟢 Web Speech Recognizer Received:", transcript);
            // resolve(transcript);
            };

            recognition.onsoundstart = () => console.log("🟡 Web Speech - detected sound");
            recognition.onspeechstart = () => console.log("🟡 Web Speech - detected speech");

            recognition.onerror = (event) => {
                console.error("🔴 Web Speech API Error:", event.error);
                resolve({
                    text: "",
                    confidence: 0,
                    source: 'web-speech',
                    error: event.error
                });
            };

            recognition.onend = () => console.log("🟢 Web Speech API Ended");

            recognition.start();
        });

        /*
        // Wait for both recognizers to return results
        const results = await Promise.all([msPromise, webSpeechPromise]);

        // Compare and choose the best result
        const finalResult = selectBestResult(results);
        setRecognizedText(finalResult);
        setIsListening(false);
        */
           // In startListening:
        const results = await Promise.allSettled([msPromise, webSpeechPromise])
        .then(promiseResults => {
            return promiseResults.map(result => result.status === 'fulfilled' ? result.value : null);
        });

    const finalResult = selectBestResult(results);
    console.log("Final Result: ", finalResult);
    setRecognizedText(finalResult);
    };
    /*
    const selectBestResult = (results) => {
        console.log("Comparing Results ...");
        const [msResult, webResult] = results.map(r => r.trim().toLowerCase());
        //console.log("Speech SDK ", msResult, "Web Speech API ", webResult);
        if (!msResult) return webResult;
        if (!webResult) return msResult;
        return msResult.length >= webResult.length ? msResult : webResult;
    };
    */

    const selectBestResult = (results) => {
        console.log("Comparing Results ...", results);
        const [msResult, webResults] = results;
        const allResults = [
            { 
                text: msResult.text, 
                confidence: msResult.reason === ResultReason.RecognizedSpeech ? 0.9 : 0.5,
                source: 'microsoft'
            },
            ...(Array.isArray(webResults) ? webResults : [])
        ].filter(r => r.text && r.text.trim());
    
        // Score each result
        const scoredResults = allResults.map(result => {
            
            const cleaned = cleanRecognizedText(result.text);
            let score = result.confidence * 100;
            
            // Bonus for exact single letter match
            if (/^[a-z]$/.test(cleaned)) score += 30;
            
            /*
            // Bonus for Microsoft results
            if (result.source === 'microsoft') score += 20;
            */
            return {
                original: result.text,
                cleaned,
                score,
                source: result.source
            };
        });
    
        // Sort by score and return best cleaned result
        scoredResults.sort((a, b) => b.score - a.score);
        return scoredResults[0]?.cleaned || '';
    };
    


    // Cancel recognition
    const stopListening = () => {
        if (isListening && recognizerRef.current) {
            recognizerRef.current.close(); // Immediately stops the recognition process
            setIsListening(false);
            recognizerRef.current = null; // Clear the ref
        };
    }

    return {recognizedText, isListening, error, startListening, stopListening};
}

export default useVoiceRecognition;