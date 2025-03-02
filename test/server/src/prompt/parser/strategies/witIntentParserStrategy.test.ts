import { WitIntentParserStrategy } from '../../../../../../server/src/prompt/parser/strategies/witIntentParserStrategy';
import config from '../../../../../../shared/config';

global.fetch = jest.fn();

describe('WitIntentParserStrategy', () => {
    const strategy = new WitIntentParserStrategy();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the intent when confidence is sufficient', async () => {
        const mockResponse = {
            intents: [{ name: 'test_intent', confidence: config.prompt_intent.wit_ai.intent_confidence_min + 0.1 }],
        };
        (fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const result = await strategy.determineIntent('test prompt');
        expect(result).toEqual({ module: 'test_intent', target: null, value: null });
    });

    it('should return "unknown" when no intent has sufficient confidence', async () => {
        const mockResponse = {
            intents: [{ name: 'test_intent', confidence: config.prompt_intent.wit_ai.intent_confidence_min - 0.1 }],
        };
        (fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const result = await strategy.determineIntent('test prompt');
        expect(result).toEqual({ module: 'unknown' });
    });

    it('should handle malformed API response', async () => {
        const mockResponse = {};
        (fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        const result = await strategy.determineIntent('test prompt');
        expect(result).toEqual({ module: 'unknown' });
    });

    it('should handle API errors gracefully', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('API error'));

        const result = await strategy.determineIntent('test prompt');
        expect(result).toEqual({ module: 'unknown' });
    });
});