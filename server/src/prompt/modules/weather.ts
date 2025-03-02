import { PromptIntentModule, PromptModuleResult } from '../../../../shared/types/prompt';

export default class WeatherIntentModule implements PromptIntentModule {
    constructor() {
        console.log("instantiating weather module");
    }
    handlePrompt(prompt: string, entity?: any): Promise<PromptModuleResult> {
        return new Promise((resolve, reject) => {
            // FIXME
            resolve({ responseMessage: "It's fuckin' hot, idiot." });
        });
    }
}