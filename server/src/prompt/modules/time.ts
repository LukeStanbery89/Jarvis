import { PromptModule, PromptModuleResult } from '../../../../shared/types/prompt';

export default class TimeModule implements PromptModule {
    handlePrompt(prompt: string): Promise<PromptModuleResult> {
        return new Promise((resolve, reject) => {
            // FIXME
            resolve({ responseMessage: "it's 5pm, homie." });
        });
    }
}