import { PromptIntentModule, PromptModuleResult } from '../../../../shared/types/prompt';

export default class TimeIntentModule implements PromptIntentModule {
    handlePrompt(prompt: string, entity?: any): Promise<PromptModuleResult> {
        return new Promise((resolve, reject) => {
            // FIXME
            resolve({ responseMessage: "it's 5pm homie." });
        });
    }
}