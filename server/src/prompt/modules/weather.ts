import { PromptModule, PromptModuleResult } from '../../../../shared/types/prompt';

export default class WeatherModule implements PromptModule {
    handlePrompt(prompt: string): Promise<PromptModuleResult> {
        return new Promise((resolve, reject) => {
            // FIXME
            resolve({ responseMessage: "It's fuckin' hot, dawg." });
        });
    }
}