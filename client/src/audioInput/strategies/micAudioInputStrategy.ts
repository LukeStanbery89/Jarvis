import mic from "mic";
import { EventEmitter } from "events";
import { AudioInputStrategy } from "../audioInputStrategy";
import { Readable } from "stream";
import { AUDIO_INPUT_EVENT } from "../../../../shared/events";

export class MicAudioInputStrategy extends EventEmitter implements AudioInputStrategy {
    private micInstance: mic.MicInstance;
    private audioStream: Readable;

    constructor(sampleRate: number = 16000) {
        super();
        this.micInstance = mic({
            rate: sampleRate.toString(),
            channels: "1",
            debug: false,
            exitOnSilence: 6,
        });
        this.audioStream = this.micInstance.getAudioStream();
        this.audioStream.on("data", (data: Buffer) => {
            this.emit(AUDIO_INPUT_EVENT.DATA, data);
        });
    }

    start() {
        console.debug("MicAudioInputStrategy", "Listening. Speak now...");
        this.micInstance.start();
    }

    stop() {
        console.debug("MicAudioInputStrategy", "Stopping...");
        this.micInstance.stop();
    }
    
    pause() {
        console.debug("MicAudioInputStrategy", "Paused");
        this.micInstance.pause();
    }
    
    resume() {
        console.debug("MicAudioInputStrategy", "Resumed");
        this.micInstance.resume();
    }

    getAudioStream(): Readable {
        return this.audioStream;
    }
}