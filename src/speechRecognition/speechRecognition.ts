import { EventEmitter } from "events";
import { AudioInputStrategy } from "../audioInput/audioInputStrategy";
import { SpeechRecognitionStrategy } from "./speechRecognitionStrategy";
import { SPEECH_RECOGNITION_EVENT, AUDIO_INPUT_EVENT } from "../events";

export class SpeechRecognition extends EventEmitter {
    private audioInputStrategy: AudioInputStrategy;
    private speechRecognitionStrategy: SpeechRecognitionStrategy;

    constructor(audioInputStrategy: AudioInputStrategy, speechRecognitionStrategy: SpeechRecognitionStrategy) {
        super();
        this.audioInputStrategy = audioInputStrategy;
        this.speechRecognitionStrategy = speechRecognitionStrategy;

        const audioInputStream = this.audioInputStrategy.getAudioStream();

        audioInputStream.on(AUDIO_INPUT_EVENT.DATA, (data: Buffer) => {
            this.speechRecognitionStrategy.acceptWaveform(data);
            const partialResult = this.speechRecognitionStrategy.partialResult();
            if (partialResult.partial) {
                this.emit(SPEECH_RECOGNITION_EVENT.PARTIAL, partialResult.partial);
            }
        });

        audioInputStream.on(AUDIO_INPUT_EVENT.ERROR, (err: Error) => {
            this.emit(SPEECH_RECOGNITION_EVENT.ERROR, err);
        });

        audioInputStream.on(AUDIO_INPUT_EVENT.SILENCE, () => {
            const finalResult = this.speechRecognitionStrategy.finalResult();
            if (finalResult.text) {
                this.emit(SPEECH_RECOGNITION_EVENT.SPEECH, finalResult.text);
            }
            this.emit(SPEECH_RECOGNITION_EVENT.SILENCE);
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