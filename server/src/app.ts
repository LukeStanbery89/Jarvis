import { parsePrompt } from './prompt/parser/promptParser';
import { WebSocketServer } from "./networking/websocketServer";
import { WEBSOCKET_EVENT } from '../../shared/events';

const webSocketServer = new WebSocketServer();

webSocketServer.on(WEBSOCKET_EVENT.MESSAGE, async (message: string) => {
    const { event, data } = JSON.parse(message);
    console.info("Received from client:", data);

    if (event === WEBSOCKET_EVENT.MESSAGE) {
        const responseText = await parsePrompt(data);
        console.info("Response:", responseText);
        webSocketServer.send(responseText);
    }
});

console.info("Jarvis server is running...");