import { PromptIntentModule, PromptModuleResult } from '../../../../shared/types/prompt';

const DEFAULT_LOCATION = 'Aurora, Illinois, US';

export default class WeatherIntentModule implements PromptIntentModule {
    async handlePrompt(prompt: string, entity?: any): Promise<PromptModuleResult> {
        const location = entity || DEFAULT_LOCATION;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${process.env.OPEN_WEATHER_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const weatherData = await response.json();
            console.debug("WeatherIntentModule", "weather data:", weatherData);
            const locationString = weatherData.name;
            const description = weatherData.weather[0].description;
            const temp = weatherData.main.temp.toFixed(0);
            const tempHigh = weatherData.main.temp_max.toFixed(0);
            const tempLow = weatherData.main.temp_min.toFixed(0);

            const responseMessage = `In ${locationString}, it is currently ${temp} degrees with ${description}. Today's high will be ${tempHigh} degrees and the low will be ${tempLow} degrees.`;
            return { responseMessage };
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return { responseMessage: "Sorry. There was an error connecting to the weather API." };
        }
    }
}