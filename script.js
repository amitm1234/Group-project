const apiKey = "748699d13e9e7e19f331eef2a1d7fbea"; // OpenWeatherMap API key

// Local 12-hour time
function getLocalTime(dt, timezone) {
  const localDate = new Date((dt + timezone) * 1000);
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours}:${minutes} ${ampm}`;
}

// Get weather details
async function getWeather() {
  const cityInput = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  result.innerHTML = "";

  if (!cityInput) {
    result.innerHTML = "<p>⚠️ Please enter a city name.</p>";
    return;
  }

  // Add ,IN automatically if not present
  const city = cityInput.includes(",") ? cityInput : cityInput + ",IN";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Loading state
    result.innerHTML = "<p>⏳ Fetching weather...</p>";

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("City not found ❌ (Try: Nanded, Pune, Mumbai)");
    }

    const data = await res.json();

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const localTime = getLocalTime(data.dt, data.timezone);

    // Display result
    result.innerHTML = `
      <h3>${data.name}, ${data.sys.country}</h3>
      <img src="${iconUrl}" alt="Weather Icon">
      <p><strong>${data.weather[0].description.toUpperCase()}</strong></p>
      <p>🌡️ Temperature: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
      <p>🕒 Local Time: ${localTime}</p>
    `;

  } catch (err) {
    result.innerHTML = `<p>${err.message}</p>`;
  }
}

// Press Enter key support
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});