require('dotenv').config();

import { getPromptResponse, parseIntent } from './prompt/parser/promptParser';
import { WebSocketServer } from "./networking/websocketServer";
import { WEBSOCKET_EVENT } from '../../shared/events';
import { WitIntentParserStrategy } from './prompt/parser/strategies/witIntentParserStrategy';
import { BANNER } from '../../shared/constants';

console.info(BANNER);

const webSocketServer = new WebSocketServer();
const intentParserStrategy = new WitIntentParserStrategy();

webSocketServer.on(WEBSOCKET_EVENT.MESSAGE, async (message: string) => {
    const { event, data } = JSON.parse(message);
    console.info("Received prompt from client:", data);

    if (event === WEBSOCKET_EVENT.MESSAGE) {
        const intentResult = await parseIntent(data, intentParserStrategy);
        const promptResponse = await getPromptResponse(data, intentResult);
        console.info("Response to client:", promptResponse);
        webSocketServer.send(promptResponse);
    }
});

console.info("Jarvis server is running...");