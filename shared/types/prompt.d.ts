export interface PromptModuleResult {
    responseMessage: string;
}

export interface PromptIntentModule {
    async handlePrompt(prompt: string, entity?: any): Promise<PromptModuleResult>;
}

export interface IntentParserStrategy {
    determineIntent(prompt: string): Promise<IntentResult>;
}

export type WitAIIntentResponse = {
    confidence: number,
    id: string,
    name: string
};
export type WitAIResponse = {
    intents: [ WitAIIntentResponse ]
};

/**
 * Represents the result of an prompt intent.
 * 
 * @property {string} module - The name of the module associated with the intent.
 * @property {any} [target] - An optional target associated with the intent.
 * @property {any} [value] - An optional value associated with the intent.
 */
export type IntentResult = {
    /**
     * Name of the intent module which should handle this prompt.
     * 
     * Example: "weather", "time", "smart_home", "message"
     */
    module: string,

    /**
     * The "target" of the prompt, such as the city where the user wants to see the weather,
     * the smart home device that the user wants to manipulate, or the recipient of a message.
     * 
     * Example: "Chicago", "living room light", "thermostat_set", "mom"
     */
    target?: any,

    /**
     * A specific value associated with an prompt, such as the temperature that the user
     * wants to set their thermostat, the state of a smart light, or the content of a message 
     * they want to send.
     * 
     * Example: "70 degress", "off", "on my way"
     */
    value?: any,
};
