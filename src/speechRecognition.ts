import { EventEmitter } from "events";
import { Model, Recognizer } from "vosk";
import { AudioInputStrategy } from "./audioInputStrategy";

export class SpeechRecognition extends EventEmitter {
    private model: Model;
    private recognizer: Recognizer<any>;
    private audioInputStrategy: AudioInputStrategy;

    constructor(modelPath: string, audioInputStrategy: AudioInputStrategy, sampleRate: number = 16000) {
        super();
        this.model = new Model(modelPath);
        this.recognizer = new Recognizer({ model: this.model, sampleRate });
        this.audioInputStrategy = audioInputStrategy;

        const audioInputStream = this.audioInputStrategy.getAudioStream();

        audioInputStream.on("data", (data: Buffer) => {
            this.recognizer.acceptWaveform(data);
            const partialResult = this.recognizer.partialResult();
            if (partialResult.partial) {
                this.emit("partial", partialResult.partial);
            }
        });

        audioInputStream.on("error", (err: Error) => {
            this.emit("error", err);
        });

        audioInputStream.on("silence", () => {
            const finalResult = this.recognizer.finalResult();
            if (finalResult.text) {
                this.emit("speech", finalResult.text);
            }
            this.emit("silence");
        });
    }

    start() {
        console.info("Listening... Speak now.");
        this.audioInputStrategy.start();
    }

    stop() {
        console.info("\nStopping...");
        this.audioInputStrategy.stop();
    }

    pause() {
        console.info("Pausing...");
        this.audioInputStrategy.pause();
    }

    resume() {
        console.info("Resuming...");
        this.audioInputStrategy.resume();
    }
}