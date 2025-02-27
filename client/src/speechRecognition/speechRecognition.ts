import { EventEmitter } from "events";
import { AudioInputStrategy } from "../audioInput/audioInputStrategy";
import { SpeechRecognitionStrategy } from "./speechRecognitionStrategy";
import { SPEECH_RECOGNITION_EVENT, AUDIO_INPUT_EVENT } from "../../../shared/events";

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
        console.info("SpeechRecognition", "Listening... Speak now.");
        this.audioInputStrategy.start();
    }

    stop() {
        console.info("SpeechRecognition", "Stopping...");
        this.audioInputStrategy.stop();
    }

    pause() {
        console.info("SpeechRecognition", "Pausing...");
        this.audioInputStrategy.pause();
    }

    resume() {
        console.info("SpeechRecognition", "Resuming...");
        this.audioInputStrategy.resume();
    }
}