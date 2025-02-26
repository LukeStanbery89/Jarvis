import { EventEmitter } from "events";
import { Model, Recognizer } from "vosk";
import mic from "mic";

export class SpeechRecognition extends EventEmitter {
    private model: Model;
    private recognizer: Recognizer<any>;
    private micInstance: mic.MicInstance;

    constructor(modelPath: string, sampleRate: number = 16000) {
        super();
        this.model = new Model(modelPath);
        this.recognizer = new Recognizer({ model: this.model, sampleRate });

        this.micInstance = mic({
            rate: sampleRate.toString(),
            channels: "1",
            debug: false,
            exitOnSilence: 6,
        });

        const micInputStream = this.micInstance.getAudioStream();

        micInputStream.on("data", (data: Buffer) => {
            this.recognizer.acceptWaveform(data);
            const partialResult = this.recognizer.partialResult();
            if (partialResult.partial) {
                this.emit("partial", partialResult.partial);
            }
        });

        micInputStream.on("error", (err: Error) => {
            this.emit("error", err);
        });

        micInputStream.on("silence", () => {
            const finalResult = this.recognizer.finalResult();
            if (finalResult.text) {
                this.emit("speech", finalResult.text);
            }
            this.emit("silence");
        });
    }

    start() {
        console.info("Listening... Speak now.");
        this.micInstance.start();
    }

    stop() {
        console.info("\nStopping...");
        this.micInstance.stop();
    }

    pause() {
        console.info("Pausing...");
        this.micInstance.pause();
    }

    resume() {
        console.info("Resuming...");
        this.micInstance.resume();
    }
}