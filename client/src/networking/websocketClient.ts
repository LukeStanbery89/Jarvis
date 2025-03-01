import { EventEmitter } from "events";
import WebSocket from 'ws';
import { sleep } from '../../../shared/utils';

export class WebSocketClient extends EventEmitter {
    private socket!: WebSocket;

    constructor() {
        super();
    }

    async initialize(address: string) {
        await sleep(2000);
        this.socket = new WebSocket(address);

        this.socket.onopen = () => {
            console.info("WebSocket connection opened");
        };

        this.socket.onmessage = (event) => {
            this.emit("message", event.data);
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.socket.onclose = () => {
            console.info("WebSocket connection closed");
        };
    }

    send(data: any) {
        if (this?.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.error("WebSocket is not open. Ready state:", this?.socket?.readyState);
        }
    }
}