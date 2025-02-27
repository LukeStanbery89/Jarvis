import { SpeechRecognition } from "./speechRecognition/speechRecognition";
import { TextToSpeech } from "./textToSpeech/textToSpeech";
import { SayTTS } from "./textToSpeech/strategies/sayTTS";
import { MicAudioInputStrategy } from "./audioInput/strategies/micAudioInputStrategy";
import { VoskSpeechRecognitionStrategy } from "./speechRecognition/strategies/voskSpeechRecognitionStrategy";

// TODO: avoid hardcoding model path
const modelPath = "model/vosk-model-small-en-us-0.15";
const audioInputStrategy = new MicAudioInputStrategy();
const speechRecognitionStrategy = new VoskSpeechRecognitionStrategy(modelPath);
const speechRecognition = new SpeechRecognition(audioInputStrategy, speechRecognitionStrategy);
const textToSpeech = new TextToSpeech(new SayTTS());

speechRecognition.on("partial", (text: string) => {
    console.info("Partial result:", text);
});

speechRecognition.on("speech", (text: string) => {
    console.info("Final result:", text);
    textToSpeech.speak(text);
});

speechRecognition.on("error", (err: Error) => {
    console.error("Error in Speech Recognition:", err);
});

speechRecognition.on("silence", () => {
    console.info("Silence detected");
});

textToSpeech.on("start", () => {
    speechRecognition.pause();
});

textToSpeech.on("end", () => {
    speechRecognition.resume();
});

speechRecognition.start();

process.on("SIGINT", () => {
    speechRecognition.stop();
    process.exit();
});