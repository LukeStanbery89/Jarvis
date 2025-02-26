import { SpeechRecognition } from "./speechRecognition";

// TODO: avoid hardcoding model path
const modelPath = "model/vosk-model-small-en-us-0.15";
const speechRecognition = new SpeechRecognition(modelPath);

speechRecognition.on("partial", (text: string) => {
  console.info("Partial result:", text);
});

speechRecognition.on("speech", (text: string) => {
  console.info("Final result:", text);
});

speechRecognition.on("error", (err: Error) => {
  console.error("Error in Speech Recognition:", err);
});

speechRecognition.on("silence", () => {
  console.info("Silence detected");
});

speechRecognition.start();

process.on("SIGINT", () => {
  speechRecognition.stop();
  process.exit();
});