import say from "say";
import { TTSStrategy } from "../ttsStrategy";
import config from "../../../../shared/config";

export class SayTTSStrategy implements TTSStrategy {
    speak(text: string, voice: string = config.tts.say.voiceFont, callback?: () => void) {
        console.debug("SayTTS", "Speaking...");
        say.speak(text, voice, 1.0, (err) => {
            if (err) {
                console.error("SayTTS", "Error in Text-to-Speech:", err);
            } else {
                console.debug("SayTTS", "Done speaking.");
            }
            if (callback) {
                callback();
            }
        });
    }
}