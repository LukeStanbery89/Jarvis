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
        console.log("emitting start");
        this.emit("start");
        this.strategy.speak(text, voice, () => {
            console.log("emitting end");
            this.emit("end");
        });
    }
}