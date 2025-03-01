import { TextToSpeech } from "./textToSpeech/textToSpeech";
import { SayTTSStrategy } from "./textToSpeech/strategies/sayTTSStrategy";
import { WebSocketClient } from "./networking/websocketClient";
import { startReplMode, startVoiceMode } from './clientHelpers';

(async () => {
    const args = process.argv.slice(2);
    const isReplMode = args.includes('--repl');

    const textToSpeech = new TextToSpeech(new SayTTSStrategy());
    const webSocketClient = new WebSocketClient();
    await webSocketClient.initialize("ws://localhost:8080");

    if (isReplMode) {
        startReplMode(webSocketClient);
    } else {
        startVoiceMode(webSocketClient, textToSpeech);
    }
})();
