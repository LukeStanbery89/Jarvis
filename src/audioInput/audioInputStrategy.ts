import { Readable } from "stream";

export interface AudioInputStrategy {
  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  getAudioStream(): Readable;
}