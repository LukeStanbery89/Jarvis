import { Model, Recognizer } from "vosk";
import { SpeechRecognitionStrategy } from "../speechRecognitionStrategy";

export class VoskSpeechRecognitionStrategy implements SpeechRecognitionStrategy {
  private recognizer: Recognizer<any>;

  constructor(modelPath: string, sampleRate: number = 16000) {
    const model = new Model(modelPath);
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
}