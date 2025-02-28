import mic from "mic";
import { MicAudioInputStrategy } from "../../../../../client/src/audioInput/strategies/micAudioInputStrategy";
import { Readable } from "stream";

jest.mock("mic");

describe("MicAudioInputStrategy", () => {
    let micAudioInputStrategy: MicAudioInputStrategy;
    let mockMicInstance: jest.Mocked<ReturnType<typeof mic>>;

    beforeEach(() => {
        mockMicInstance = {
            start: jest.fn(),
            stop: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            getAudioStream: jest.fn().mockReturnValue(new Readable({
                read() {
                    this.push(null); // End the stream immediately
                }
            })),
        } as unknown as jest.Mocked<ReturnType<typeof mic>>;

        (mic as jest.Mock).mockReturnValue(mockMicInstance);

        micAudioInputStrategy = new MicAudioInputStrategy();
    });

    it("should start the mic instance", () => {
        micAudioInputStrategy.start();
        expect(mockMicInstance.start).toHaveBeenCalled();
    });

    it("should stop the mic instance", () => {
        micAudioInputStrategy.stop();
        expect(mockMicInstance.stop).toHaveBeenCalled();
    });

    it("should pause the mic instance", () => {
        micAudioInputStrategy.pause();
        expect(mockMicInstance.pause).toHaveBeenCalled();
    });

    it("should resume the mic instance", () => {
        micAudioInputStrategy.resume();
        expect(mockMicInstance.resume).toHaveBeenCalled();
    });

    it("should return the audio stream", () => {
        const audioStream = micAudioInputStrategy.getAudioStream();
        expect(audioStream).toBeInstanceOf(Readable);
        expect(mockMicInstance.getAudioStream).toHaveBeenCalled();
    });
});