import { WebSocketServer } from "../../../../server/src/networking/websocketServer";
import WebSocket, { WebSocketServer as WSServer } from "ws";
import { PromptModuleResult } from '../../../../shared/types/prompt';

jest.mock("ws");

describe("WebSocketServer", () => {
    let webSocketServer: WebSocketServer;
    let mockWss: jest.Mocked<WSServer>;
    let mockWs: jest.Mocked<WebSocket>;

    beforeEach(() => {
        mockWs = {
            on: jest.fn(),
            send: jest.fn(),
            readyState: 1, // WebSocket.OPEN
        } as unknown as jest.Mocked<WebSocket>;

        mockWss = {
            on: jest.fn(),
            clients: new Set([mockWs]),
        } as unknown as jest.Mocked<WSServer>;

        (WSServer as unknown as jest.Mock).mockImplementation(() => mockWss);

        webSocketServer = new WebSocketServer();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize the WebSocket server", () => {
        expect(WSServer).toHaveBeenCalledWith({ port: 8080 });
        expect(mockWss.on).toHaveBeenCalledWith("connection", expect.any(Function));
    });

    it("should log a message when a connection is opened", () => {
        const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => { });

        const connectionHandler = mockWss.on.mock.calls.find(call => call[0] === "connection")![1];
        connectionHandler.call(mockWss, mockWs);

        expect(consoleInfoSpy).toHaveBeenCalledWith("WebSocketServer", "connection opened");

        consoleInfoSpy.mockRestore();
    });

    it("should emit 'message' event when a message is received", () => {
        const messageHandler = jest.fn();
        webSocketServer.on("message", messageHandler);

        const connectionHandler = mockWss.on.mock.calls.find(call => call[0] === "connection")![1];
        connectionHandler.call(mockWss, mockWs);

        const messageEventHandler = mockWs.on.mock.calls.find(call => call[0] === "message")![1];
        messageEventHandler.call(mockWs, "test message");

        expect(messageHandler).toHaveBeenCalledWith("test message");
    });

    it("should log an error when a WebSocket error occurs", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        const connectionHandler = mockWss.on.mock.calls.find(call => call[0] === "connection")![1];
        connectionHandler.call(mockWss, mockWs);

        const errorEventHandler = mockWs.on.mock.calls.find(call => call[0] === "error")![1];
        const error = new Error("test error");
        errorEventHandler.call(mockWs, error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("WebSocketServer", error);

        consoleErrorSpy.mockRestore();
    });

    it("should log a message when the WebSocket connection is closed", () => {
        const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation(() => { });

        const connectionHandler = mockWss.on.mock.calls.find(call => call[0] === "connection")![1];
        connectionHandler.call(mockWss, mockWs);

        const closeEventHandler = mockWs.on.mock.calls.find(call => call[0] === "close")![1];
        closeEventHandler.call(mockWs);

        expect(consoleInfoSpy).toHaveBeenCalledWith("WebSocketServer", "connection closed");

        consoleInfoSpy.mockRestore();
    });

    it("should send data to all connected clients", () => {
        const data: PromptModuleResult = { responseMessage: "test data" };
        webSocketServer.send(data);

        expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it("should not send data to clients that are not open", () => {
        const closedMockWs = {
            ...mockWs,
            readyState: WebSocket.CLOSED,
        } as unknown as jest.Mocked<WebSocket>;
        mockWss.clients = new Set([closedMockWs]);
        webSocketServer.send({ responseMessage: "test data" });

        expect(mockWs.send).not.toHaveBeenCalled();
    });
});