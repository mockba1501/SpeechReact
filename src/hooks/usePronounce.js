
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const startLetterByLetterAssessment = () => {
    const speechConfig = sdk.SpeechConfig.fromSubscription("YourSubscriptionKey", "YourRegion");
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

    // Set up the reference text with letters spaced out
    const referenceText = "W E L C O M E";
    const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
        referenceText,
        sdk.PronunciationAssessmentGradingSystem.HundredMark,
        sdk.PronunciationAssessmentGranularity.Phoneme // Granularity for detailed assessment
    );

    pronunciationConfig.enableMiscue = true; // Enables detection of mispronunciations

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationConfig.applyTo(recognizer);

    recognizer.recognizeOnceAsync(result => {
        const jsonResult = result.properties.getProperty(sdk.PropertyId.SpeechServiceResponse_JsonResult);
        console.log("Pronunciation Assessment Result:", JSON.parse(jsonResult));
    });
};
