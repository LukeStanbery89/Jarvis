import { PromptIntentModule, PromptModuleResult } from '../../../../shared/types/prompt';

export default class TimeIntentModule implements PromptIntentModule {
    async handlePrompt(_prompt: string, _entity?: any): Promise<PromptModuleResult> {
        return new Promise((resolve, reject) => {
            try {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const period = hours >= 12 ? 'pm' : 'am';
                const formattedHours = hours % 12 || 12;
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                resolve({ responseMessage: `It's ${formattedHours}:${formattedMinutes}${period}.` });
            } catch (error) {
                reject({ responseMessage: "Sorry. There was an error determining the time." });
            }
        });
    }
}