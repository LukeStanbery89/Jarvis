import { SpeechRecognition } from "./speechRecognition/speechRecognition";
import { TextToSpeech } from "./textToSpeech/textToSpeech";
import { SayTTS } from "./textToSpeech/strategies/sayTTS";
import { MicAudioInputStrategy } from "./audioInput/strategies/micAudioInputStrategy";
import { VoskSpeechRecognitionStrategy } from "./speechRecognition/strategies/voskSpeechRecognitionStrategy";
import { IO_EVENT, SPEECH_RECOGNITION_EVENT, TTS_EVENT } from "../../shared/events";
import { WAKE_PHRASES } from "../../shared/constants";
import { WebSocketClient } from "./networking/websocketClient";

const audioInputStrategy = new MicAudioInputStrategy();
const speechRecognitionStrategy = new VoskSpeechRecognitionStrategy();
const speechRecognition = new SpeechRecognition(audioInputStrategy, speechRecognitionStrategy);
const textToSpeech = new TextToSpeech(new SayTTS());
    
const webSocketClient = new WebSocketClient();
webSocketClient.initialize("ws://localhost:8080");

speechRecognition.on(SPEECH_RECOGNITION_EVENT.PARTIAL, (text: string) => {
    console.debug("Partial result:", text);
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.SPEECH, (text: string) => {
    console.debug("Final result:", text);
    const lowerCaseText = text.toLowerCase();
    const wakePhrase = WAKE_PHRASES.find(phrase => lowerCaseText.includes(phrase));

    if (wakePhrase) {
        const prompt = text.slice(lowerCaseText.indexOf(wakePhrase) + wakePhrase.length).trim();
        webSocketClient.send(JSON.stringify({ event: 'message', data: prompt }));
    }
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.ERROR, (err: Error) => {
    console.error("Error in Speech Recognition:", err);
});

speechRecognition.on(SPEECH_RECOGNITION_EVENT.SILENCE, () => {
    console.debug("Silence detected");
});

textToSpeech.on(TTS_EVENT.START, () => {
    console.debug("TTS start")
    speechRecognition.pause();
});

textToSpeech.on(TTS_EVENT.END, () => {
    console.debug("TTS end")
    speechRecognition.resume();
});

console.info("Jarvis client is running...");
speechRecognition.start();

process.on(IO_EVENT.SIGINT, () => {
    console.debug("SIGINT")
    speechRecognition.stop();
    process.exit();
});

webSocketClient.on('message', (responseText: string) => {
    textToSpeech.speak(responseText);
});