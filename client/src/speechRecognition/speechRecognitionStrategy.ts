export interface SpeechRecognitionStrategy {
    acceptWaveform(data: Buffer): void;
    partialResult(): { partial: string; };
    finalResult(): { text: string; };
    clearPartial(): void;
}