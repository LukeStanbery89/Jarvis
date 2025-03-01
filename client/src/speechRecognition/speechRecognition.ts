import { EventEmitter } from "events";
import { AudioInputStrategy } from "../audioInput/audioInputStrategy";
import { SpeechRecognitionStrategy } from "./speechRecognitionStrategy";
import { SPEECH_RECOGNITION_EVENT, AUDIO_INPUT_EVENT } from "../../../shared/events";

export class SpeechRecognition extends EventEmitter {
    private audioInputStrategy: AudioInputStrategy;
    private speechRecognitionStrategy: SpeechRecognitionStrategy;
    private partialTimeout: NodeJS.Timeout | null = null;
    private previousPartial: string | null = null;
    private lastPartialChangeTime: number = Date.now();
    private readonly PARTIAL_TIMEOUT_MS = 2000; // 2 seconds

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
                
                // Sometimes the user is done talking, but the audioInputStream is not silent.
                // In this case, check how long since the last time the partial input changed.
                this.checkPartialTimeout(partialResult.partial);
            }
        });

        audioInputStream.on(AUDIO_INPUT_EVENT.ERROR, (err: Error) => {
            this.emit(SPEECH_RECOGNITION_EVENT.ERROR, err);
        });

        audioInputStream.on(AUDIO_INPUT_EVENT.SILENCE, () => {
            const finalResult = this.speechRecognitionStrategy.finalResult()?.text;
            this.emitFinalResult(finalResult);
        });
    }

    private checkPartialTimeout(currentPartial: string) {
        const currentTime = Date.now();
        if (this.previousPartial !== currentPartial) {
            this.lastPartialChangeTime = currentTime;
            this.previousPartial = currentPartial;

            if (this.partialTimeout) {
                clearTimeout(this.partialTimeout);
            }
    
            this.partialTimeout = setTimeout(() => {
                this.emitFinalResult(currentPartial);
            }, this.PARTIAL_TIMEOUT_MS);
        }
    }

    private emitFinalResult(finalResult: string) {
        if (finalResult) {
            this.emit(SPEECH_RECOGNITION_EVENT.SPEECH, finalResult);
            if (this.speechRecognitionStrategy.partialResult()) {
                this.speechRecognitionStrategy.clearPartial();
            }
        }
        this.emit(SPEECH_RECOGNITION_EVENT.SILENCE);
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