import { EventEmitter } from "events";
import { TTSStrategy } from "./ttsStrategy";

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
        this.emit("start");
        this.strategy.speak(text, voice, () => {
            this.emit("end");
        });
    }
}