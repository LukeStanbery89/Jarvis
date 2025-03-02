import TimeIntentModule from '../../../../../server/src/prompt/modules/time';
import { PromptModuleResult } from '../../../../../shared/types/prompt';

describe('TimeIntentModule', () => {
    let timeIntentModule: TimeIntentModule;

    beforeEach(() => {
        timeIntentModule = new TimeIntentModule();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return the current time in a human-comprehensible format', async () => {
        const mockDate = new Date(2025, 2, 2, 14, 41); // March 2, 2025, 14:41 (2:41 PM)
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const result: PromptModuleResult = await timeIntentModule.handlePrompt('');
        expect(result.responseMessage).toBe("It's 2 41 pm.");
    });

    it('should handle midnight correctly', async () => {
        const mockDate = new Date(2025, 2, 2, 0, 5); // March 2, 2025, 00:05 (12:05 AM)
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const result: PromptModuleResult = await timeIntentModule.handlePrompt('');
        expect(result.responseMessage).toBe("It's 12 05 am.");
    });

    it('should handle noon correctly', async () => {
        const mockDate = new Date(2025, 2, 2, 12, 0); // March 2, 2025, 12:00 (12:00 PM)
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

        const result: PromptModuleResult = await timeIntentModule.handlePrompt('');
        expect(result.responseMessage).toBe("It's 12 00 pm.");
    });

    it('should handle errors gracefully', async () => {
        jest.spyOn(global, 'Date').mockImplementation(() => { throw new Error('Test error'); });

        try {
            await timeIntentModule.handlePrompt('');
        } catch (result) {
            const errorResult = result as PromptModuleResult;
            expect(errorResult.responseMessage).toBe("Sorry. There was an error determining the time.");
        }
    });
});