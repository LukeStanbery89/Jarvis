import { getResponse } from "./promptResponse";
import { WebSocketServer } from "./networking/websocketServer";

const webSocketServer = new WebSocketServer();

webSocketServer.on('message', (message: string) => {
    const { event, data } = JSON.parse(message);

    if (event === 'message') {
        const responseText = getResponse(data);
        webSocketServer.send(responseText);
    }
});

console.info("Jarvis server is running...");