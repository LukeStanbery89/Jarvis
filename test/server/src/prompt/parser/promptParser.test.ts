import { parsePrompt } from '../../../../../server/src/prompt/parser/promptParser';
import WeatherModule from '../../../../../server/src/prompt/modules/weather';
import TimeModule from '../../../../../server/src/prompt/modules/time';
import { PromptModuleResult } from '../../../../../shared/types/prompt';

jest.mock('../../../../../server/src/prompt/modules/weather');
jest.mock('../../../../../server/src/prompt/modules/time');

describe('parsePrompt', () => {
    let mockWeatherModule: jest.Mocked<WeatherModule>;
    let mockTimeModule: jest.Mocked<TimeModule>;

    beforeEach(() => {
        mockWeatherModule = new WeatherModule() as jest.Mocked<WeatherModule>;
        mockTimeModule = new TimeModule() as jest.Mocked<TimeModule>;

        mockWeatherModule.handlePrompt = jest.fn();
        mockTimeModule.handlePrompt = jest.fn();

        (WeatherModule as jest.Mock).mockImplementation(() => mockWeatherModule);
        (TimeModule as jest.Mock).mockImplementation(() => mockTimeModule);
    });

    it('should return the correct response for weather intent', async () => {
        const prompt = 'How is the weather?';
        const expectedResponse: PromptModuleResult = { responseMessage: 'The weather is sunny.' };
        mockWeatherModule.handlePrompt.mockResolvedValue(expectedResponse);

        const result = await parsePrompt(prompt);

        expect(result).toEqual(expectedResponse);
        expect(mockWeatherModule.handlePrompt).toHaveBeenCalledWith(prompt);
    });

    it('should return the correct response for time intent', async () => {
        const prompt = 'What time is it?';
        const expectedResponse: PromptModuleResult = { responseMessage: 'The time is 10:00 AM.' };
        mockTimeModule.handlePrompt.mockResolvedValue(expectedResponse);

        const result = await parsePrompt(prompt);

        expect(result).toEqual(expectedResponse);
        expect(mockTimeModule.handlePrompt).toHaveBeenCalledWith(prompt);
    });

    it('should return a default response for unknown intent', async () => {
        const prompt = 'Tell me a joke.';
        const expectedResponse: PromptModuleResult = { responseMessage: "Sorry, I don't know how to help with that yet." };

        const result = await parsePrompt(prompt);

        expect(result).toEqual(expectedResponse);
    });
});