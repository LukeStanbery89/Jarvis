import config from '../../../../../shared/config';
import { IntentParserStrategy, IntentResult, WitAIIntentResponse, WitAIResponse } from '../../../../../shared/types/prompt';

export class WitIntentParserStrategy implements IntentParserStrategy {
    async determineIntent(prompt: string): Promise<IntentResult> {
        let data: WitAIResponse | null = null;
        try {
            const response = await fetch(`https://api.wit.ai/message?v=20201004&q=${encodeURIComponent(prompt)}`, {
                headers: {
                    Authorization: `Bearer ${process.env.WIT_AI_BEARER_TOKEN}`
                },
            });
            data = await response.json();
        } catch (error) {
            console.error("WitIntentParserStrategy", "API Error");
        }

        let intent: WitAIIntentResponse | undefined;

        try {
            intent = data?.intents.find(intent => {
                return intent.confidence >= config.prompt_intent.wit_ai.intent_confidence_min;
            });
        } catch (error) {
            console.error("WitIntentParserStrategy", "error parsing Wit.AI response");
        }

        if (!intent) {
            return { module: "unknown" };
        } else {
            return {
                module: intent.name,
                // TODO: Parse the entities to get this data
                target: null,
                value: null,
            };
        }
    }
}