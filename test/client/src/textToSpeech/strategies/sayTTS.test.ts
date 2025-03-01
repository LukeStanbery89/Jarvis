import say from "say";
import { SayTTSStrategy } from "../../../../../client/src/textToSpeech/strategies/sayTTSStrategy";
import config from "../../../../../shared/config";

jest.mock("say");

describe("SayTTS", () => {
    let sayTTS: SayTTSStrategy;

    beforeEach(() => {
        sayTTS = new SayTTSStrategy();
    });

    it("should call say.speak with the correct arguments", () => {
        const text = "Hello, world!";
        const voice = config.tts.say.voiceFont;
        const callback = jest.fn();

        sayTTS.speak(text, voice, callback);

        expect(say.speak).toHaveBeenCalledWith(text, voice, 1.0, expect.any(Function));
    });

    it("should call the callback after speaking", (done) => {
        const text = "Hello, world!";
        const voice = config.tts.say.voiceFont;
        const callback = jest.fn(() => {
            done();
        });

        (say.speak as jest.Mock).mockImplementation((text, voice, speed, cb) => {
            cb();
        });

        sayTTS.speak(text, voice, callback);

        expect(callback).toHaveBeenCalled();
    });

    it("should log an error if say.speak returns an error", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });
        const text = "Hello, world!";
        const voice = config.tts.say.voiceFont;
        const error = new Error("Test error");

        (say.speak as jest.Mock).mockImplementation((text, voice, speed, cb) => {
            cb(error);
        });

        sayTTS.speak(text, voice);

        expect(consoleErrorSpy).toHaveBeenCalledWith("SayTTS", "Error in Text-to-Speech:", error);

        consoleErrorSpy.mockRestore();
    });

    it("should log a message when text-to-speech is completed", () => {
        const consoleLogSpy = jest.spyOn(console, "debug").mockImplementation(() => { });
        const text = "Hello, world!";
        const voice = config.tts.say.voiceFont;

        (say.speak as jest.Mock).mockImplementation((text, voice, speed, cb) => {
            cb();
        });

        sayTTS.speak(text, voice);

        expect(consoleLogSpy).toHaveBeenCalledWith("SayTTS", "Text-to-Speech completed");

        consoleLogSpy.mockRestore();
    });
});