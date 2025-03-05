import { WAKE_PHRASES } from '../../shared/constants';
import { IO_EVENT, SPEECH_RECOGNITION_EVENT, TTS_EVENT, WEBSOCKET_EVENT } from '../../shared/events';
import { PromptModuleResult } from '../../shared/types/prompt';
import { WebSocketClient } from './networking/websocketClient';
import { TextToSpeech } from './textToSpeech/textToSpeech';

export function startReplMode(webSocketClient: WebSocketClient) {
    let result: PromptModuleResult;
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('line', (line: string) => {
        webSocketClient.send(JSON.stringify({ event: WEBSOCKET_EVENT.MESSAGE, data: line.trim() }));
    });

    webSocketClient.on(WEBSOCKET_EVENT.MESSAGE, (resultString: string) => {
        result = JSON.parse(resultString);
        console.log(`Jarvis: ${result.responseMessage}`);
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
    let result: PromptModuleResult;

    // Speech Recognition
    speechRecognition.on(SPEECH_RECOGNITION_EVENT.PARTIAL, (text: string) => {
        // console.debug("Partial result:", text);
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
        // console.debug("Silence detected");
    });

    // Text To Speech
    textToSpeech.on(TTS_EVENT.START, () => {
        console.debug("TTS start");
        speechRecognition.pause();
    });
    textToSpeech.on(TTS_EVENT.END, () => {
        console.debug("TTS end");
        speechRecognition.resume();
    });

    // Web Socket Client
    webSocketClient.on(WEBSOCKET_EVENT.MESSAGE, (resultString: string) => {
        try {
            result = JSON.parse(resultString);
            console.log(`Jarvis: ${result.responseMessage}`);
            textToSpeech.speak(result.responseMessage);
        } catch (error: any) {
            console.error("Error parsing response from server: ", error);
            textToSpeech.speak("Sorry. There was an error parsing the result from the server.");
        }
    });
    webSocketClient.on(WEBSOCKET_EVENT.CONNECTION_ERROR, () => {
        textToSpeech.speak("There was a problem connecting to the server. Please try again later.")
    });

    // Gracefully handle program exit
    process.on(IO_EVENT.SIGINT, () => {
        speechRecognition.stop();
        process.exit();
    });

    // Start the service
    console.info("Jarvis client is running...");
    speechRecognition.start();
}