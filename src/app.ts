import { SpeechRecognition } from "./speechRecognition/speechRecognition";
import { TextToSpeech } from "./textToSpeech/textToSpeech";
import { SayTTS } from "./textToSpeech/strategies/sayTTS";
import { MicAudioInputStrategy } from "./audioInput/strategies/micAudioInputStrategy";
import { VoskSpeechRecognitionStrategy } from "./speechRecognition/strategies/voskSpeechRecognitionStrategy";
import { IO_EVENT, SPEECH_RECOGNITION_EVENT, TTS_EVENT } from "./events";

const audioInputStrategy = new MicAudioInputStrategy();
const speechRecognitionStrategy = new VoskSpeechRecognitionStrategy();
const speechRecognition = new SpeechRecognition(audioInputStrategy, speechRecognitionStrategy);
const textToSpeech = new TextToSpeech(new SayTTS());

speechRecognition.on(SPEECH_RECOGNITION_EVENT.PARTIAL, (text: string) => {
    console.info("Partial result:", text);
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.SPEECH, (text: string) => {
    console.info("Final result:", text);
    textToSpeech.speak(text);
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.ERROR, (err: Error) => {
    console.error("Error in Speech Recognition:", err);
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.SILENCE, () => {
    console.info("Silence detected");
});

textToSpeech.on(TTS_EVENT.START, () => {
    speechRecognition.pause();
});

textToSpeech.on(TTS_EVENT.END, () => {
    speechRecognition.resume();
});

speechRecognition.start();

process.on(IO_EVENT.SIGINT, () => {
    speechRecognition.stop();
    process.exit();
});