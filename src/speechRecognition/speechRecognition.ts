import { EventEmitter } from "events";
import { AudioInputStrategy } from "../audioInput/audioInputStrategy";
import { SpeechRecognitionStrategy } from "./speechRecognitionStrategy";

export class SpeechRecognition extends EventEmitter {
    private audioInputStrategy: AudioInputStrategy;
    private speechRecognitionStrategy: SpeechRecognitionStrategy;

    constructor(audioInputStrategy: AudioInputStrategy, speechRecognitionStrategy: SpeechRecognitionStrategy) {
        super();
        this.audioInputStrategy = audioInputStrategy;
        this.speechRecognitionStrategy = speechRecognitionStrategy;

        const audioInputStream = this.audioInputStrategy.getAudioStream();

        audioInputStream.on("data", (data: Buffer) => {
            this.speechRecognitionStrategy.acceptWaveform(data);
            const partialResult = this.speechRecognitionStrategy.partialResult();
            if (partialResult.partial) {
                this.emit("partial", partialResult.partial);
            }
        });

        audioInputStream.on("error", (err: Error) => {
            this.emit("error", err);
        });

        audioInputStream.on("silence", () => {
            const finalResult = this.speechRecognitionStrategy.finalResult();
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