import { Model, Recognizer } from "vosk";
import { VoskSpeechRecognitionStrategy } from "../../../../src/speechRecognition/strategies/voskSpeechRecognitionStrategy";
import config from "../../../../../../client/src/config";

jest.mock("vosk");

describe("VoskSpeechRecognitionStrategy", () => {
    let voskSpeechRecognitionStrategy: VoskSpeechRecognitionStrategy;
    let mockRecognizer: jest.Mocked<Recognizer<any>>;

    beforeEach(() => {
        const mockModel = new Model(config.modelPath);
        mockRecognizer = new Recognizer({ model: mockModel, sampleRate: 16000 }) as jest.Mocked<Recognizer<any>>;
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
        const finalResult = { text: "final result", spk: [], spk_frames: 0, result: [] };
        mockRecognizer.finalResult.mockReturnValue(finalResult);

        const result = voskSpeechRecognitionStrategy.finalResult();
        expect(result).toBe(finalResult);
    });
});