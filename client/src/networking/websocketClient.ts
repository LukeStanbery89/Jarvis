import { EventEmitter } from "events";
import WebSocket from 'ws';
import config from '../../../shared/config';
import { WEBSOCKET_EVENT } from '../../../shared/events';

export class WebSocketClient extends EventEmitter {
    private socket!: WebSocket;
    private address!: string;

    constructor() {
        super();
    }

    async initialize(address: string) {
        this.address = address;
        await this.connect();
    }

    private async connect() {
        this.socket = new WebSocket(this.address);

        this.socket.onopen = () => {
            console.info("WebSocket connection opened");
            this.emit("connect");
        };

        this.socket.onmessage = (event) => {
            this.emit("message", event.data);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error.message);
        };

        this.socket.onclose = () => {
            console.info("WebSocket connection closed, attempting to reconnect...");
            setTimeout(() => this.reconnect(), config.websocket.reconnectInterval);
        };
    }

    private async reconnect() {
        console.info("Reconnecting to WebSocket...");
        await this.connect();
    }

    send(data: any) {
        if (this?.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.error("WebSocket is not open. Ready state:", this?.socket?.readyState);
            this.emit(WEBSOCKET_EVENT.CONNECTION_ERROR);
        }
    }
}