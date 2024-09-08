import { useState, useEffect } from 'react';
import styles from "../styles/WeatherDashboard.module.css"; 


const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  // Mapping weather conditions to emojis
  const getWeatherEmoji = (description) => {
    switch (description) {
      case 'clear sky':
        return '☀️';
      case 'few clouds':
        return '🌤';
      case 'scattered clouds':
        return '🌥';
      case 'broken clouds':
        return '☁️';
      case 'shower rain':
      case 'rain':
        return '🌧';
      case 'thunderstorm':
        return '⛈';
      case 'snow':
        return '❄️';
      case 'mist':
        return '🌫';
      default:
        return '🌡';
    }
  };

  useEffect(() => {
    if (location.lat && location.lon) {
      const fetchWeatherData = async () => {
        try {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
          );
          const weatherData = await weatherResponse.json();
          setWeather(weatherData);

          const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,hourly&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
          );
          const forecastData = await forecastResponse.json();
          setForecast(forecastData.daily);
        } catch (err) {
          setError('Error fetching weather data');
        }
      };
      fetchWeatherData();
    }
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setError('Error retrieving location');
        }
      );
    }
  }, []);

  if (error) return <p>{error}</p>;
  if (!weather) return <p>Loading current weather...</p>;

  return (
    <div className={styles.weatherContainer}>
      <h1 className={styles.title}>🌍 Weather Dashboard</h1>
      <h2 className={styles.subtitle}>
        {getWeatherEmoji(weather.weather[0].description)} {weather.name}
      </h2>
      <p className={styles.description}>{weather.weather[0].description}</p>
      <p className={styles.temperature}>🌡 {weather.main.temp}°C</p>

      <h2 className={styles.forecastTitle}>📅 7-Day Forecast</h2>
      {forecast && forecast.length > 0 ? (
        <ul className={styles.forecastList}>
          {forecast.map((day, index) => (
            <li key={index} className={styles.forecastItem}>
              {new Date(day.dt * 1000).toLocaleDateString()}:
              {getWeatherEmoji(day.weather[0].description)} {day.weather[0].description}, {day.temp.day}°C
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading forecast...</p>
      )}
    </div>
  );
};

export default WeatherDashboard;
