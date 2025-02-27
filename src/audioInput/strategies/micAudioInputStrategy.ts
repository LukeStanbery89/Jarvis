import mic from "mic";
import { AudioInputStrategy } from "../audioInputStrategy";
import { Readable } from "stream";

export class MicAudioInputStrategy implements AudioInputStrategy {
  private micInstance: mic.MicInstance;

  constructor(sampleRate: number = 16000) {
    this.micInstance = mic({
      rate: sampleRate.toString(),
      channels: "1",
      debug: false,
      exitOnSilence: 6,
    });
  }

  start() {
    this.micInstance.start();
  }

  stop() {
    this.micInstance.stop();
  }

  pause() {
    this.micInstance.pause();
  }

  resume() {
    this.micInstance.resume();
  }

  getAudioStream(): Readable {
    return this.micInstance.getAudioStream();
  }
}