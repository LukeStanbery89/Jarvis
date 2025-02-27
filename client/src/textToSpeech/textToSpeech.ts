import { EventEmitter } from "events";
import { TTSStrategy } from "./ttsStrategy";
import { TTS_EVENT } from "../../../shared/events";

export class TextToSpeech extends EventEmitter {
    private strategy: TTSStrategy;

    constructor(strategy: TTSStrategy) {
        super();
        this.strategy = strategy;
    }

    setStrategy(strategy: TTSStrategy) {
        this.strategy = strategy;
    }

    speak(text: string, voice?: string) {
        this.emit(TTS_EVENT.START);
        this.strategy.speak(text, voice, () => {
            this.emit(TTS_EVENT.END);
        });
    }
}