import { getResponse } from "./promptResponse";
import { WebSocketServer } from "./networking/websocketServer";
import { WEBSOCKET_EVENT } from '../../shared/events';

const webSocketServer = new WebSocketServer();

webSocketServer.on(WEBSOCKET_EVENT.MESSAGE, (message: string) => {
    const { event, data } = JSON.parse(message);

    if (event === WEBSOCKET_EVENT.MESSAGE) {
        const responseText = getResponse(data);
        webSocketServer.send(responseText);
    }
});

console.info("Jarvis server is running...");