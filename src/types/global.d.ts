export {};

declare global {
    interface Window {
        webkitSpeechRecognition: typeof SpeechRecognition;
        SpeechRecognition: typeof SpeechRecognition;
    }
    // any other globals you need

    interface AuthResult {
        authToken: string | null;
        region: string | null;
        error?: string;
    }
    interface TokenResponse {
        token: string;
        region: string;
    }

    interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent {
        error: string;
        message?: string;
    };

    interface ProcessedResult {
        original: string;
        letter: string;
        confidence: number;
        source: SourceType;
    }

    interface RecognitionMessage {
    type: 'info' | 'success' | 'warning' | 'error';
    text: string;
}
}