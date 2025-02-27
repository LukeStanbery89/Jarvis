import { EventEmitter } from "events";
import { TextToSpeech } from "../../../src/textToSpeech/textToSpeech";
import { TTSStrategy } from "../../../src/textToSpeech/ttsStrategy";
import { TTS_EVENT } from "../../../src/events";

class MockTTSStrategy implements TTSStrategy {
    speak(text: string, voice?: string, callback?: () => void) {
        if (callback) {
            callback();
        }
    }
}

describe("TextToSpeech", () => {
    let textToSpeech: TextToSpeech;
    let mockStrategy: MockTTSStrategy;

    beforeEach(() => {
        mockStrategy = new MockTTSStrategy();
        textToSpeech = new TextToSpeech(mockStrategy);
    });

    it("should emit START event when speak is called", (done) => {
        textToSpeech.on(TTS_EVENT.START, () => {
            done();
        });
        textToSpeech.speak("Hello, world!");
    });

    it("should emit END event when speak is called", (done) => {
        textToSpeech.on(TTS_EVENT.END, () => {
            done();
        });
        textToSpeech.speak("Hello, world!");
    });

    it("should call the strategy's speak method with the correct arguments", () => {
        const spy = jest.spyOn(mockStrategy, "speak");
        const text = "Hello, world!";
        const voice = "Alex";

        textToSpeech.speak(text, voice);

        expect(spy).toHaveBeenCalledWith(text, voice, expect.any(Function));
    });

    it("should allow changing the strategy", () => {
        const newStrategy = new MockTTSStrategy();
        textToSpeech.setStrategy(newStrategy);

        const spy = jest.spyOn(newStrategy, "speak");
        const text = "Hello, world!";
        const voice = "Alex";

        textToSpeech.speak(text, voice);

        expect(spy).toHaveBeenCalledWith(text, voice, expect.any(Function));
    });
});