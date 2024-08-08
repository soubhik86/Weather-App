import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./Home.css";

const apiKey = "f66d9727501911f62c328508b94c5e3e";

const fetchWeather = async ({ queryKey }) => {
  const [_, city] = queryKey;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(weatherUrl);
  return response.data;
};

const fetchForecast = async ({ queryKey }) => {
  const [_, city] = queryKey;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await axios.get(forecastUrl);
  return response.data;
};

export const Home = () => {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const { data: weatherData, isLoading: isLoadingWeather } = useQuery({
    queryKey: ["weather", searchCity],
    queryFn: fetchWeather,
    enabled: !!searchCity,
  });

  const { data: forecastData, isLoading: isLoadingForecast } = useQuery({
    queryKey: ["forecast", searchCity],
    queryFn: fetchForecast,
    enabled: !!searchCity,
  });

  const handleSearch = () => {
    setSearchCity(city);
  };

  const getFiveDayForecast = () => {
    if (!forecastData) return [];

    const dailyForecasts = [];
    const forecastMap = {};

    forecastData.list.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      if (!forecastMap[date]) {
        forecastMap[date] = forecast;
      }
    });

    Object.keys(forecastMap).forEach((date) => {
      dailyForecasts.push(forecastMap[date]);
    });

    return dailyForecasts.slice(0, 5);
  };

  const fiveDayForecast = getFiveDayForecast();

  return (
    <div className="container">
      <h1 className="header">Weather Forecast</h1>
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="data-container">
        {isLoadingWeather ? (
          <p className="loading-text">Loading...</p>
        ) : (
          weatherData && (
            <div className="weather-card">
              <h2>Current Weather</h2>
              <p>Description: {weatherData.weather[0].description}</p>
              <p>Temperature: {weatherData.main.temp} °C</p>
              <p>Max Temperature: {weatherData.main.temp_max} °C</p>
              <p>Min Temperature: {weatherData.main.temp_min} °C</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>
                Sunrise:{" "}
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
              </p>
              <p>
                Sunset:{" "}
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </p>
              <p>Country: {weatherData.sys.country}</p>
              <p>Pressure: {weatherData.main.pressure} hPa</p>
            </div>
          )
        )}
        {isLoadingForecast ? (
          <p className="loading-text">Loading...</p>
        ) : (
          forecastData && (
            <div className="forecast-list">
              <h2 className="header">5-Day Forecast</h2>

              {fiveDayForecast.map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <p>
                    Date: {new Date(forecast.dt * 1000).toLocaleDateString()}
                  </p>
                  <p>Temperature: {forecast.main.temp} °C</p>
                  <p>Weather: {forecast.weather[0].description}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
