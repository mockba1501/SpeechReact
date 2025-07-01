export {};

declare global {
    interface Window {
        webkitSpeechRecognition: typeof SpeechRecognition;
        SpeechRecognition: typeof SpeechRecognition;
    }
    // any other globals you need
    //Used in association with getTokenOrRefresh
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

    interface WordItem {
        word: string;
        hint: string;
    }

    interface CategorizedLetter {
        letter: string;
        color: 'green' | 'yellow' | 'red';
    }

    interface GameDetails {
        id: string,
        name: string,
        description: string,
        requiresSettings: boolean,
        fetchWords: boolean,
        fetchPath: string,
        projectID: string
    }

    interface GameSetting {
        id: string,
        label: string,
        options: string[]
    }

    interface GameSettingItem {
        id: string;
        value: string;
    }

    type GameSettings = Record<string, GameSetting[]>;
    type GameSettingsMap = Record<string, string>;
    type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

    //FeedbackPage types
    interface WordAttempt {
        word: string;
        correctLetters: string[];
        incorrectLetters: string[];
        accuracy?: number;
        precision?: number;
        attempts?: {
            recognitionMode: string;
            timestamp: number;
            categorizedWord: CategorizedLetter[];
        }[];
    }
}