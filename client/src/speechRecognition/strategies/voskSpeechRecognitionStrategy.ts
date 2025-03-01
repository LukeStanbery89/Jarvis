import { Model, Recognizer } from "vosk";
import { SpeechRecognitionStrategy } from "../speechRecognitionStrategy";
import config from "../../../../shared/config";

export class VoskSpeechRecognitionStrategy implements SpeechRecognitionStrategy {
    private recognizer: Recognizer<any>;

    constructor(sampleRate: number = 16000) {
        const model = new Model(config.modelPath);
        this.recognizer = new Recognizer({ model, sampleRate });
    }

    acceptWaveform(data: Buffer) {
        this.recognizer.acceptWaveform(data);
    }

    partialResult() {
        return this.recognizer.partialResult();
    }

    finalResult() {
        return this.recognizer.finalResult();
    }

    clearPartial() {
        this.recognizer.reset();
    }
}