import iconWeatherSunny from '@app/assets/images/weather/ic_weather_sunny.png';
import iconWeatherFewClouds from '@app/assets/images/weather/ic_weather_few_clouds.png';
import iconWeatherCloud from '@app/assets/images/weather/ic_weather_cloud.png';
import iconWeatherRain from '@app/assets/images/weather/ic_weather_rain.png';
import iconWeatherRainThunderstorm from '@app/assets/images/weather/ic_weather_rain_thunderstorm.png';
import iconWeatherSnow from '@app/assets/images/weather/ic_weather_snow.png';
import iconWeatherWind from '@app/assets/images/weather/ic_weather_wind.png';
import iconWeatherNight from '@app/assets/images/weather/ic_weather_night.png';
import iconWeatherNightClouds from '@app/assets/images/weather/ic_weather_night_clouds.png';

export function getWeatherIcon(icon) {
    switch (icon) {
        case '01d':
            return iconWeatherSunny;
        case '02d':
            return iconWeatherFewClouds;
        case '03d':
        case '04d':
            return iconWeatherCloud;
        case '09d':
        case '10d':
            return iconWeatherRain;
        case '11d':
            return iconWeatherRainThunderstorm;
        case '13d':
            return iconWeatherSnow;
        case '50d':
            return iconWeatherWind;
        case '01n':
            return iconWeatherNight;
        case '02n':
        case '03n':
        case '04n':
            return iconWeatherNightClouds;
        case '09n':
        case '10n':
            return iconWeatherRain;
        case '11n':
            return iconWeatherRainThunderstorm;
        case '13n':
            return iconWeatherSnow;
        case '50n':
            return iconWeatherWind;
        default:
            return null;
    }
}