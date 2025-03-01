export interface PromptModuleResult {
    responseMessage: string;
}

export interface PromptModule {
    handlePrompt(prompt: string): Promise<PromptModuleResult>;
}