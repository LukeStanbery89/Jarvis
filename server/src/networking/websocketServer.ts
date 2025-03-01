import { EventEmitter } from "events";
import * as WebSocket from "ws";
import { PromptModuleResult } from '../../../shared/types/prompt';

export class WebSocketServer extends EventEmitter {
    private wss: WebSocket.Server;

    constructor() {
        super();
        this.wss = new WebSocket.Server({ port: 8080 });

        this.wss.on("connection", (ws: WebSocket) => {
            console.info("WebSocketServer", "connection opened");

            ws.on("message", (message: string) => {
                this.emit("message", message);
            });

            ws.on("error", (error) => {
                console.error("WebSocketServer", error);
            });

            ws.on("close", () => {
                console.info("WebSocketServer", "connection closed");
            });
        });
    }

    send(result: PromptModuleResult) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(result));
            }
        });
    }
}