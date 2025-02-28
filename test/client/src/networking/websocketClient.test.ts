import { WebSocketClient } from "../../../../client/src/networking/websocketClient";
import WebSocket from 'ws';

jest.mock('ws');
jest.mock('../../../../shared/utils', () => ({
    sleep: jest.fn(),
}));

describe("WebSocketClient", () => {
    let webSocketClient: WebSocketClient;
    let mockWebSocket: jest.Mocked<WebSocket>;

    beforeEach(() => {
        webSocketClient = new WebSocketClient();
        mockWebSocket = {
            send: jest.fn(),
            close: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            readyState: WebSocket.OPEN,
        } as unknown as jest.Mocked<WebSocket>;

        (WebSocket as unknown as jest.Mock).mockImplementation(() => mockWebSocket);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize the WebSocket connection", async () => {
        await webSocketClient.initialize("ws://localhost:8080");
        expect(WebSocket).toHaveBeenCalledWith("ws://localhost:8080");
        expect(mockWebSocket.onopen).toBeDefined();
        expect(mockWebSocket.onmessage).toBeDefined();
        expect(mockWebSocket.onerror).toBeDefined();
        expect(mockWebSocket.onclose).toBeDefined();
    });

    it("should emit 'message' event when a message is received", async () => {
        const messageHandler = jest.fn();
        webSocketClient.on("message", messageHandler);

        await webSocketClient.initialize("ws://localhost:8080");
        const event = { data: "test message" } as WebSocket.MessageEvent;
        mockWebSocket.onmessage!(event);

        expect(messageHandler).toHaveBeenCalledWith("test message");
    });

    it("should log an error when a WebSocket error occurs", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        await webSocketClient.initialize("ws://localhost:8080");
        const error = { error: "error", type: "type" } as WebSocket.ErrorEvent;
        mockWebSocket.onerror!(error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("WebSocket error:", error);

        consoleErrorSpy.mockRestore();
    });

    it("should log a message when the WebSocket connection is closed", async () => {
        const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => { });

        await webSocketClient.initialize("ws://localhost:8080");
        const close = {} as WebSocket.CloseEvent;
        mockWebSocket.onclose!(close);

        expect(consoleInfoSpy).toHaveBeenCalledWith("WebSocket connection closed");

        consoleInfoSpy.mockRestore();
    });

    it("should send data when the WebSocket is open", async () => {
        await webSocketClient.initialize("ws://localhost:8080");
        const data = "test data";
        webSocketClient.send(data);

        expect(mockWebSocket.send).toHaveBeenCalledWith(data);
    });

    it("should log an error when trying to send data while the WebSocket is not open", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        mockWebSocket = {
            send: jest.fn(),
            close: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            readyState: WebSocket.CLOSED,
        } as unknown as jest.Mocked<WebSocket>;
        (WebSocket as unknown as jest.Mock).mockImplementation(() => mockWebSocket);

        await webSocketClient.initialize("ws://localhost:8080");
        const data = "test data";
        webSocketClient.send(data);

        expect(consoleErrorSpy).toHaveBeenCalledWith("WebSocket is not open. Ready state:", WebSocket.CLOSED);

        consoleErrorSpy.mockRestore();
    });
});