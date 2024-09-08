// components/WeatherDashboard.js
import { useState, useEffect } from 'react';

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  // Fetch weather data
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
            `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location.lat}&lon=${location.lon}&cnt=7&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
          );
          const forecastData = await forecastResponse.json();
          setForecast(forecastData.list);
        } catch (err) {
          setError('Error fetching weather data');
        }
      };
      fetchWeatherData();
    }
  }, [location]);

  // Get the user's location
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
  if (!weather) return <p>Loading...</p>;

  return (
    <div>
      <h1>Weather Dashboard</h1>
      <h2>Current Weather: {weather.name}</h2>
      <p>{weather.weather[0].description}</p>
      <p>Temperature: {weather.main.temp}°C</p>

      <h2>7-Day Forecast</h2>
      <ul>
        {forecast.map((day, index) => (
          <li key={index}>
            {new Date(day.dt * 1000).toLocaleDateString()}: {day.weather[0].description}, {day.temp.day}°C
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherDashboard;
