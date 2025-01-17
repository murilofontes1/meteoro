import React, { useState, useEffect } from "react";
import axios from "axios";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = "fac7f065bfa560269419a2dd54c994e0";

const villageImages = {
  sunny: "https://i.imgur.com/I5yfNHe.png", // Sunny (Leaf Village)
  rainy: "https://i.imgur.com/ijRLybR.png", // Rainy (Rain Village)
  cloudy: "https://i.imgur.com/eLbbRSv.png", // Cloudy (Cloud Village)
  snowy: "https://i.imgur.com/inNVH1v.png", // Snowy (Snow Village)
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            lat: latitude,
            lon: longitude,
            units: "metric",
            appid: WEATHER_API_KEY,
          },
        });
        setWeatherData(response.data);

        const weatherMain = response.data.weather[0].main.toLowerCase();
        if (weatherMain.includes("clear")) setCurrentImage(villageImages.sunny);
        else if (weatherMain.includes("rain")) setCurrentImage(villageImages.rainy);
        else if (weatherMain.includes("cloud")) setCurrentImage(villageImages.cloudy);
        else if (weatherMain.includes("snow")) setCurrentImage(villageImages.snowy);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again.");
        console.error(err);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (err) => {
            setError("Failed to get your location. Please allow location access.");
            console.error(err);
          }
        );
      } else {
        setError("Geolocation is not supported by your browser.");
      }
    };

    getUserLocation();
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!weatherData) return <div>Loading weather information...</div>;

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        backgroundColor: "black", // Dark background
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "400px",
          height: "500px",
          borderRadius: "15px",
          border: "3px solid white",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            color: "white",
            textShadow: "1px 1px 2px black",
            maxWidth: "90%",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            {weatherData.name}, {weatherData.sys.country}
          </h1>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            {new Date().toLocaleTimeString()}
          </h2>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt="weather icon"
            style={{ width: "80px", marginBottom: "10px" }}
          />
          <h2 style={{ fontSize: "2rem", margin: "10px 0" }}>
            {weatherData.main.temp}°C
          </h2>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
            {weatherData.weather[0].description}
          </h3>
          <p><strong>Precipitation:</strong> {weatherData.rain ? `${weatherData.rain["1h"]} mm` : "No rain"}</p>
          <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
        </div>
      </div>
    </div>
  );
};

export default App;