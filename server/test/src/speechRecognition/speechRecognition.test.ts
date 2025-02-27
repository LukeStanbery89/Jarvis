import { Readable } from "stream";
import { SpeechRecognition } from "../../../src/speechRecognition/speechRecognition";
import { AudioInputStrategy } from "../../../../client/src/audioInput/audioInputStrategy";
import { SpeechRecognitionStrategy } from "../../../src/speechRecognition/speechRecognitionStrategy";
import { SPEECH_RECOGNITION_EVENT, AUDIO_INPUT_EVENT } from "../../../../client/src/events";

class MockAudioInputStrategy extends Readable implements AudioInputStrategy {
    start() {
        this.emit(AUDIO_INPUT_EVENT.DATA, Buffer.from("test data"));
    }
    stop() {
        this.emit(AUDIO_INPUT_EVENT.SILENCE);
    }
    pause() { return this; }
    resume() { return this; }
    getAudioStream() {
        return this;
    }
}

class MockSpeechRecognitionStrategy implements SpeechRecognitionStrategy {
    acceptWaveform(data: Buffer) { }
    partialResult() {
        return { partial: "partial result" };
    }
    finalResult() {
        return { text: "final result" };
    }
}

describe("SpeechRecognition", () => {
    let audioInputStrategy: MockAudioInputStrategy;
    let speechRecognitionStrategy: MockSpeechRecognitionStrategy;
    let speechRecognition: SpeechRecognition;

    beforeEach(() => {
        audioInputStrategy = new MockAudioInputStrategy();
        speechRecognitionStrategy = new MockSpeechRecognitionStrategy();
        speechRecognition = new SpeechRecognition(audioInputStrategy, speechRecognitionStrategy);
    });

    it("should emit PARTIAL event when data is received", (done) => {
        speechRecognition.on(SPEECH_RECOGNITION_EVENT.PARTIAL, (text: string) => {
            expect(text).toBe("partial result");
            done();
        });
        audioInputStrategy.emit(AUDIO_INPUT_EVENT.DATA, Buffer.from("test data"));
    });

    it("should emit SPEECH event when silence is detected", (done) => {
        speechRecognition.on(SPEECH_RECOGNITION_EVENT.SPEECH, (text: string) => {
            expect(text).toBe("final result");
            done();
        });
        audioInputStrategy.emit(AUDIO_INPUT_EVENT.SILENCE);
    });

    it("should emit ERROR event when an error occurs", (done) => {
        const error = new Error("test error");
        speechRecognition.on(SPEECH_RECOGNITION_EVENT.ERROR, (err: Error) => {
            expect(err).toBe(error);
            done();
        });
        audioInputStrategy.emit(AUDIO_INPUT_EVENT.ERROR, error);
    });

    it("should start the audio input strategy when start is called", () => {
        const spy = jest.spyOn(audioInputStrategy, "start");
        speechRecognition.start();
        expect(spy).toHaveBeenCalled();
    });

    it("should stop the audio input strategy when stop is called", () => {
        const spy = jest.spyOn(audioInputStrategy, "stop");
        speechRecognition.stop();
        expect(spy).toHaveBeenCalled();
    });

    it("should pause the audio input strategy when pause is called", () => {
        const spy = jest.spyOn(audioInputStrategy, "pause");
        speechRecognition.pause();
        expect(spy).toHaveBeenCalled();
    });

    it("should resume the audio input strategy when resume is called", () => {
        const spy = jest.spyOn(audioInputStrategy, "resume");
        speechRecognition.resume();
        expect(spy).toHaveBeenCalled();
    });
});