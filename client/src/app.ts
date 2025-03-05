import { TextToSpeech } from "./textToSpeech/textToSpeech";
import { SayTTSStrategy } from "./textToSpeech/strategies/sayTTSStrategy";
import { WebSocketClient } from "./networking/websocketClient";
import { startReplMode, startVoiceMode } from './clientHelpers';
import config from '../../shared/config';
import { BANNER } from '../../shared/constants';

(async () => {
    const args = process.argv.slice(2);
    const isReplMode = args.includes('--repl');

    const webSocketClient = new WebSocketClient();
    await webSocketClient.initialize(`ws://localhost:${config.websocket.port}`);

    if (isReplMode) {
        startReplMode(webSocketClient);
    } else {
        startVoiceMode(webSocketClient, new TextToSpeech(new SayTTSStrategy()));
    }
})();
