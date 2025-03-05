import { parseIntent, getPromptResponse } from '../../../../../server/src/prompt/parser/promptParser';
import WeatherIntentModule from '../../../../../server/src/prompt/modules/weather';
import TimeIntentModule from '../../../../../server/src/prompt/modules/time';
import { IntentParserStrategy, IntentResult, PromptModuleResult } from '../../../../../shared/types/prompt';

jest.mock('../../../../../server/src/prompt/modules/weather');
jest.mock('../../../../../server/src/prompt/modules/time');

class MockIntentParserStrategy implements IntentParserStrategy {
    async determineIntent(prompt: string): Promise<IntentResult> {
        if (prompt.includes('weather')) {
            return { module: 'weather' };
        } else if (prompt.includes('time')) {
            return { module: 'time' };
        } else {
            return { module: 'unknown' };
        }
    }
}

describe('parseIntent', () => {
    let strategy: IntentParserStrategy;

    beforeEach(() => {
        strategy = new MockIntentParserStrategy();
    });

    it('should determine weather intent', async () => {
        const prompt = 'How is the weather?';
        const expectedIntent: IntentResult = { module: 'weather' };

        const intent = await parseIntent(prompt, strategy);

        expect(intent).toEqual(expectedIntent);
    });

    it('should determine time intent', async () => {
        const prompt = 'What time is it?';
        const expectedIntent: IntentResult = { module: 'time' };

        const intent = await parseIntent(prompt, strategy);

        expect(intent).toEqual(expectedIntent);
    });

    it('should determine unknown intent', async () => {
        const prompt = 'Tell me a joke.';
        const expectedIntent: IntentResult = { module: 'unknown' };

        const intent = await parseIntent(prompt, strategy);

        expect(intent).toEqual(expectedIntent);
    });

    it('should handle intents with values', async () => {
        class ValueIntentParserStrategy implements IntentParserStrategy {
            async determineIntent(prompt: string): Promise<IntentResult> {
                return { module: 'weather', value: 'sunny' };
            }
        }

        const valueStrategy = new ValueIntentParserStrategy();
        const prompt = 'How is the weather?';
        const expectedIntent: IntentResult = { module: 'weather', value: 'sunny' };

        const intent = await parseIntent(prompt, valueStrategy);

        expect(intent).toEqual(expectedIntent);
    });
});

describe('getPromptResponse', () => {
    let mockWeatherModule: jest.Mocked<WeatherIntentModule>;
    let mockTimeModule: jest.Mocked<TimeIntentModule>;

    beforeEach(() => {
        mockWeatherModule = new WeatherIntentModule() as jest.Mocked<WeatherIntentModule>;
        mockTimeModule = new TimeIntentModule() as jest.Mocked<TimeIntentModule>;

        mockWeatherModule.handlePrompt = jest.fn();
        mockTimeModule.handlePrompt = jest.fn();

        (WeatherIntentModule as jest.Mock).mockImplementation(() => mockWeatherModule);
        (TimeIntentModule as jest.Mock).mockImplementation(() => mockTimeModule);
    });

    it('should return the correct response for weather intent', async () => {
        const prompt = 'How is the weather?';
        const intent: IntentResult = { module: 'weather' };
        const expectedResponse: PromptModuleResult = { responseMessage: 'The weather is sunny.' };
        mockWeatherModule.handlePrompt.mockResolvedValue(expectedResponse);

        const result = await getPromptResponse(prompt, intent);

        expect(result).toEqual(expectedResponse);
        expect(mockWeatherModule.handlePrompt).toHaveBeenCalledWith(prompt, undefined);
    });

    it('should return the correct response for time intent', async () => {
        const prompt = 'What time is it?';
        const intent: IntentResult = { module: 'time' };
        const expectedResponse: PromptModuleResult = { responseMessage: 'The time is 10:00 AM.' };
        mockTimeModule.handlePrompt.mockResolvedValue(expectedResponse);

        const result = await getPromptResponse(prompt, intent);

        expect(result).toEqual(expectedResponse);
        expect(mockTimeModule.handlePrompt).toHaveBeenCalledWith(prompt, undefined);
    });

    it('should return a default response for unknown intent', async () => {
        const prompt = 'Tell me a joke.';
        const intent: IntentResult = { module: 'unknown' };
        const expectedResponse: PromptModuleResult = { responseMessage: "Sorry, I don't know how to help with that yet." };

        const result = await getPromptResponse(prompt, intent);

        expect(result).toEqual(expectedResponse);
    });

    it('should handle intents with values', async () => {
        const prompt = 'How is the weather?';
        const intent: IntentResult = { module: 'weather', value: 'sunny' };
        const expectedResponse: PromptModuleResult = { responseMessage: 'The weather is sunny.' };
        mockWeatherModule.handlePrompt.mockResolvedValue(expectedResponse);

        const result = await getPromptResponse(prompt, intent);

        expect(result).toEqual(expectedResponse);
        expect(mockWeatherModule.handlePrompt).toHaveBeenCalledWith(prompt, 'sunny');
    });
});