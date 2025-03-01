import { PromptModule, PromptModuleResult } from '../../../../shared/types/prompt';
import TimeModule from '../modules/time';
import WeatherModule from '../modules/weather';

const modules: { [key: string]: () => PromptModule } = {
    weather: () => new WeatherModule(),
    time: () => new TimeModule(),
};

export async function parsePrompt(prompt: string): Promise<PromptModuleResult> {
    const intent = await determineIntent(prompt);
    console.debug("intent:", intent);

    if (modules[intent]) {
        return modules[intent]().handlePrompt(prompt);
    } else {
        return { responseMessage: "Sorry, I don't know how to help with that yet." };
    }
}

async function determineIntent(prompt: string): Promise<string> {
    // // Implement intent recognition using an AI-driven package
    // // Example using Wit.ai
    // const response = await fetch(`https://api.wit.ai/message?v=20201004&q=${encodeURIComponent(prompt)}`, {
    //     headers: { Authorization: `Bearer YOUR_WIT_AI_TOKEN` },
    // });
    // const data = await response.json();
    // return data.intents[0]?.name || 'unknown';

    if (prompt.toLowerCase().indexOf("weather") > -1) {
        return "weather";
    } else if (prompt.toLowerCase().indexOf("time") > -1) {
        return "time";
    } else {
        return "unknown";
    }
}
