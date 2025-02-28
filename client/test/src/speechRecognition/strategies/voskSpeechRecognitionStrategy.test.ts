import { Model, Recognizer } from "vosk";
import { VoskSpeechRecognitionStrategy } from "../../../../src/speechRecognition/strategies/voskSpeechRecognitionStrategy";
import config from "../../../../../shared/config";

jest.mock("vosk");

describe("VoskSpeechRecognitionStrategy", () => {
    let voskSpeechRecognitionStrategy: VoskSpeechRecognitionStrategy;
    let mockRecognizer: jest.Mocked<Recognizer<any>>;

    beforeEach(() => {
        const mockModel = {} as Model;
        mockRecognizer = {
            acceptWaveform: jest.fn(),
            partialResult: jest.fn(),
            finalResult: jest.fn(),
            reset: jest.fn(),
            free: jest.fn(),
        } as unknown as jest.Mocked<Recognizer<any>>;

        (Model as jest.Mock).mockImplementation(() => mockModel);
        (Recognizer as jest.Mock).mockImplementation(() => mockRecognizer);

        voskSpeechRecognitionStrategy = new VoskSpeechRecognitionStrategy();
    });

    it("should accept waveform data", () => {
        const data = Buffer.from("test data");
        voskSpeechRecognitionStrategy.acceptWaveform(data);
        expect(mockRecognizer.acceptWaveform).toHaveBeenCalledWith(data);
    });

    it("should return partial result", () => {
        const partialResult = { partial: "partial result" };
        mockRecognizer.partialResult.mockReturnValue(partialResult);

        const result = voskSpeechRecognitionStrategy.partialResult();
        expect(result).toBe(partialResult);
    });

    it("should return final result", () => {
        const finalResult = { text: "final result", spk: [1], spk_frames: 1, result: [] };
        mockRecognizer.finalResult.mockReturnValue(finalResult);

        const result = voskSpeechRecognitionStrategy.finalResult();
        expect(result).toBe(finalResult);
    });
});