import { getResponse } from "../../../server/src/promptResponse";

describe("getResponse", () => {
    it("should return a default response for any prompt", () => {
        const prompt = "How do I make a sandwich?";
        const response = getResponse(prompt);
        expect(response).toBe("It sounds like you said How do I make a sandwich?");
    });

    it("should return the same default response for an empty prompt", () => {
        const prompt = "";
        const response = getResponse(prompt);
        expect(response).toBe("It sounds like you said ");
    });
});