export interface TTSStrategy {
    speak(text: string, voice?: string, callback?: () => void): void;
}