import { SpeechRecognition } from "./speechRecognition";
import { TextToSpeech } from "./textToSpeech";
import { SayTTS } from "./sayTTS";
import { MicAudioInputStrategy } from "./micAudioInputStrategy";

// TODO: avoid hardcoding model path
const modelPath = "model/vosk-model-small-en-us-0.15";
const audioInputStrategy = new MicAudioInputStrategy();
const speechRecognition = new SpeechRecognition(modelPath, audioInputStrategy);
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