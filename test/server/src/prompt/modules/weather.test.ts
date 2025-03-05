import WeatherIntentModule from '../../../../../server/src/prompt/modules/weather';
import { PromptModuleResult } from '../../../../../shared/types/prompt';

describe('WeatherIntentModule', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    const weatherModule = new WeatherIntentModule();

    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should return weather data for a given location', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                name: 'Aurora',
                weather: [{ description: 'clear sky' }],
                main: { temp: 75, temp_max: 80, temp_min: 70 }
            })
        };
        mockFetch.mockResolvedValue(mockResponse);

        const result: PromptModuleResult = await weatherModule.handlePrompt('weather', 'Aurora, Illinois, US');
        expect(result.responseMessage).toBe("In Aurora, it is currently 75 degrees with clear sky. Today's high will be 80 degrees with a low of 70.");
    });

    it('should return an error message when the API call fails', async () => {
        mockFetch.mockResolvedValue({ ok: false });

        const result: PromptModuleResult = await weatherModule.handlePrompt('weather', 'Aurora, Illinois, US');
        expect(result.responseMessage).toBe("Sorry. There was an error connecting to the weather API.");
    });

    it('should return weather data for the default location when no entity is provided', async () => {
        const mockResponse = {
            ok: true,
            json: async () => ({
                name: 'Aurora',
                weather: [{ description: 'clear sky' }],
                main: { temp: 75, temp_max: 80, temp_min: 70 }
            })
        };
        mockFetch.mockResolvedValue(mockResponse);

        const result: PromptModuleResult = await weatherModule.handlePrompt('weather');
        expect(result.responseMessage).toBe("In Aurora, it is currently 75 degrees with clear sky. Today's high will be 80 degrees with a low of 70.");
    });

    it('should handle JSON parsing errors gracefully', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => { throw new Error('JSON parse error'); }
        });

        const result: PromptModuleResult = await weatherModule.handlePrompt('weather', 'Aurora, Illinois, US');
        expect(result.responseMessage).toBe("Sorry. There was an error connecting to the weather API.");
    });
});