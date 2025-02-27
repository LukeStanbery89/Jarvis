import { getResponse } from "../../src/promptResponse";

describe("getResponse", () => {
    it("should return a default response for any prompt", () => {
        const prompt = "How do I make a sandwich?";
        const response = getResponse(prompt);
        expect(response).toBe("Hello, I don't know how to help with that yet.");
    });

    it("should return the same default response for an empty prompt", () => {
        const prompt = "";
        const response = getResponse(prompt);
        expect(response).toBe("Hello, I don't know how to help with that yet.");
    });
});