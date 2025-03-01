import { WAKE_PHRASES } from '../../shared/constants';
import { IO_EVENT, SPEECH_RECOGNITION_EVENT, TTS_EVENT, WEBSOCKET_EVENT } from '../../shared/events';
import { WebSocketClient } from './networking/websocketClient';
import { TextToSpeech } from './textToSpeech/textToSpeech';

export function startReplMode(webSocketClient: WebSocketClient) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (line: string) => {
        webSocketClient.send(JSON.stringify({ event: WEBSOCKET_EVENT.MESSAGE, data: line.trim() }));
    });

    webSocketClient.on(WEBSOCKET_EVENT.MESSAGE, (responseText: string) => {
        console.log(`Jarvis: ${responseText}`);
        rl.prompt();
    });

    webSocketClient.on(WEBSOCKET_EVENT.CONNECT, (responseText: string) => {
        rl.setPrompt('> ');
        rl.prompt();
    });

    console.info("Jarvis REPL is running...");
}

export function startVoiceMode(webSocketClient: WebSocketClient, textToSpeech: TextToSpeech) {
    const { SpeechRecognition } = require("./speechRecognition/speechRecognition");
    const { MicAudioInputStrategy } = require("./audioInput/strategies/micAudioInputStrategy");
    const { VoskSpeechRecognitionStrategy } = require("./speechRecognition/strategies/voskSpeechRecognitionStrategy");
    const speechRecognition = new SpeechRecognition(new MicAudioInputStrategy(), new VoskSpeechRecognitionStrategy());

    speechRecognition.on(SPEECH_RECOGNITION_EVENT.PARTIAL, (text: string) => {
        console.debug("Partial result:", text);
    });

    speechRecognition.on(SPEECH_RECOGNITION_EVENT.SPEECH, (text: string) => {
        console.debug("You:", text);
        const lowerCaseText = text.toLowerCase();
        const wakePhrase = WAKE_PHRASES.find(phrase => lowerCaseText.includes(phrase));

        if (wakePhrase) {
            const prompt = text.slice(lowerCaseText.indexOf(wakePhrase) + wakePhrase.length).trim();
            webSocketClient.send(JSON.stringify({ event: WEBSOCKET_EVENT.MESSAGE, data: prompt }));
        }
    });

    speechRecognition.on(SPEECH_RECOGNITION_EVENT.ERROR, (err: Error) => {
        console.error("Error in Speech Recognition:", err);
    });

    speechRecognition.on(SPEECH_RECOGNITION_EVENT.SILENCE, () => {
        console.debug("Silence detected");
    });

    textToSpeech.on(TTS_EVENT.START, () => {
        console.debug("TTS start");
        speechRecognition.pause();
    });

    textToSpeech.on(TTS_EVENT.END, () => {
        console.debug("TTS end");
        speechRecognition.resume();
    });

    console.info("Jarvis client is running...");
    speechRecognition.start();

    webSocketClient.on(WEBSOCKET_EVENT.MESSAGE, (responseText: string) => {
        console.log(`Jarvis: ${responseText}`);
        textToSpeech.speak(responseText);
    });

    webSocketClient.on(WEBSOCKET_EVENT.CONNECTION_ERROR, () => {
        textToSpeech.speak("There was a problem connecting to the server. Please try again later.")
    });

    process.on(IO_EVENT.SIGINT, () => {
        console.debug("SIGINT");
        speechRecognition.stop();
        process.exit();
    });
}