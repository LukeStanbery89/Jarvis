import { IntentParserStrategy, IntentResult, PromptIntentModule, PromptModuleResult } from '../../../../shared/types/prompt';
import TimeIntentModule from '../modules/time';
import WeatherIntentModule from '../modules/weather';

// FIXME: This creates a new instance of the prompt intent module with each user prompt.
// Let's consider using a singleton. The challenge is not breaking the tests.
const modules: { [key: string]: () => PromptIntentModule } = {
    weather: () => new WeatherIntentModule(),
    time: () => new TimeIntentModule(),
};

export async function parseIntent(prompt: string, strategy: IntentParserStrategy): Promise<IntentResult> {
    const intent = await strategy.determineIntent(prompt);
    console.info(`Determined intent to be: ${intent.module}`);
    return intent;
}

export async function getPromptResponse(prompt: string, intent: IntentResult) {
    if (modules[intent.module]) {
        return await modules[intent.module]().handlePrompt(prompt, intent.value);
    } else {
        return { responseMessage: "Sorry, I don't know how to help with that yet." };
    }
}