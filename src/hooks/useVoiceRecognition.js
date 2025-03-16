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
        "jay": "j",
        "kay": "k",
        "el": "l",
        "em": "m",
        "en": "n",
        "oh": "o",
        "ohh": "o",
        "pee": "p",
        "cue": "q",
        "are": "r",
        "ar": "r",
        "ess": "s",
        "tee": "t",
        "tea": "t",
        "vee": "v",
        "you": "u",
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
            const tokenObj = await getTokenOrRefresh();
            if (!tokenObj.authToken) {
                console.error("Authorization token is null or undefined");
                throw new Error("Authorization token is null or undefined");
            }

            //console.log("speechsdk: ",speechsdk)
            const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
            speechConfig.speechRecognitionLanguage = 'en-US';
            // Use the custom model endpoint
            const speechEndPoint = import.meta.env.VITE_APP_SPEECH_ENDPOINT;
            
            speechConfig.endpointId = speechEndPoint; // Replace with your endpoint ID
            //console.log("Speech Endpoint ",speechEndPoint);

            const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
            recognizerRef.current = recognizer;

            recognizer.recognizeOnceAsync(result => {
                setIsListening(false);
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
                recognizer.close();
            });
        } catch(error)
        {
            setIsListening(false);
            setError(error.message);
        }
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