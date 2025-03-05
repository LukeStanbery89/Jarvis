export default {
    modelPath: "model/vosk-model-small-en-us-0.15",
    tts: {
        say: {
            voiceFont: "Alex",
        },
    },
    websocket: {
        reconnectInterval: 5000, // 5 seconds
        port: 8080,
    },
    prompt_intent: {
        wit_ai: {
            intent_confidence_min: 0.80,
        }
    }
};