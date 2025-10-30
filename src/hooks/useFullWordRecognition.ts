import { useState, useRef } from 'react';
import { getTokenOrRefresh } from "../token_util";
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

const cleanRecognizedText = (text:string) => {
    let cleanedWord = "";
    console.log("Cleaning ", text); 
    // Normalize the text: lowercase and trim whitespace
    cleanedWord = text.trim().toLowerCase();
    // Removing extra . at the end
    cleanedWord = cleanedWord.replace(/\.$/, "");
    // Removing extra white spaces and special characters
    cleanedWord = cleanedWord.replace(/[^\w]/g, "");

    return cleanedWord;
}
const useFullWordRecognition = () => {
    const [recognizedWord, setRecognizedWord] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognizerRef = useRef<speechsdk.SpeechRecognizer | null>(null);

    const startListening = async () => {
        setIsListening(true);
        setError(null);

        try {
            const tokenObj: AuthResult = await getTokenOrRefresh();
            console.log(tokenObj);
            if (!tokenObj.authToken || !tokenObj.region) {
                alert("Voice features are still initializing. Please try again in a moment.");
                console.error("Authorization token is null or undefined");
                throw new Error("Authorization token is null or undefined");
            }

            const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
            speechConfig.speechRecognitionLanguage = 'en-US';
            //const speechEndPoint = import.meta.env.VITE_APP_SPEECH_ENDPOINT;
            //speechConfig.endpointId = speechEndPoint;

            const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
            const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
            recognizerRef.current = recognizer;

            recognizer.recognizeOnceAsync(result => {
                setIsListening(false);
                if (result.reason === ResultReason.RecognizedSpeech) {
                    const spokenWord = result.text.trim().toLowerCase();
                    const cleanedWord = cleanRecognizedText(spokenWord);
                    setRecognizedWord(cleanedWord);
                    console.log("Detected ", cleanedWord);
                } else {
                    setError("Speech recognition failed or was canceled.");
                    console.log("Speech recognition failed or was canceled.");
                }
                recognizer.close();
            });
        } catch (error:unknown) {
            setIsListening(false);
            const errMessage = error instanceof Error ? error.message : 'Unknown error';
            setError(errMessage);
            console.log(error);
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

    return { recognizedWord, isListening, error, startListening, stopListening };
};

export default useFullWordRecognition;
