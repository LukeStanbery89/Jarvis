import say from "say";
import { TTSStrategy } from "../ttsStrategy";
import config from "../../config";

export class SayTTS implements TTSStrategy {
    speak(text: string, voice: string = config.tts.say.voiceFont, callback?: () => void) {
        say.speak(text, voice, 1.0, (err) => {
            if (err) {
                console.error("Error in Text-to-Speech:", err);
            } else {
                console.info("Text-to-Speech completed");
            }
            if (callback) {
                callback();
            }
        });
    }
}