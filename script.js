const apiKey1 = "1222f8df043b447aa48180246263103";
const apiKey2 = "748699d13e9e7e19f331eef2a1d7fbea";

// 🔹 Convert timestamp → readable time (OpenWeather साठी)
function getLocalTime(dt, timezone) {
  const localDate = new Date((dt + timezone) * 1000);
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
}

async function getWeather() {
  const cityInput = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  result.innerHTML = "";

  if (!cityInput) {
    result.innerHTML = "<p>⚠️ Please enter a city name.</p>";
    return;
  }

  try {
    // 🔥 First API → WeatherAPI
    let res1 = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey1}&q=${cityInput}`);
    let data1 = await res1.json();

    if (data1.error) throw new Error("WeatherAPI failed");

    result.innerHTML = `
      <h3>${data1.location.name}, ${data1.location.country}</h3>
      <img src="https:${data1.current.condition.icon}">
      <p><strong>${data1.current.condition.text}</strong></p>
      <p>🌡️ Temperature: ${data1.current.temp_c}°C</p>
      <p>💧 Humidity: ${data1.current.humidity}%</p>
      <p>🌬️ Wind: ${data1.current.wind_kph} km/h</p>
      <p>🕒 Local Time: ${data1.location.localtime}</p>
      <p style="font-size:12px;color:#94a3b8;">Source: WeatherAPI</p>
    `;

  } catch (err) {

    try {
      // 🔥 Second API → OpenWeatherMap
      let city = cityInput.includes(",") ? cityInput : cityInput + ",IN";

      let res2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey2}&units=metric`);
      let data2 = await res2.json();

      if (data2.cod !== 200) throw new Error("Both APIs failed");

      const localTime = getLocalTime(data2.dt, data2.timezone);

      result.innerHTML = `
        <h3>${data2.name}, ${data2.sys.country}</h3>
        <img src="https://openweathermap.org/img/wn/${data2.weather[0].icon}@2x.png">
        <p><strong>${data2.weather[0].description}</strong></p>
        <p>🌡️ Temperature: ${data2.main.temp}°C</p>
        <p>💧 Humidity: ${data2.main.humidity}%</p>
        <p>🌬️ Wind: ${data2.wind.speed} m/s</p>
        <p>🕒 Local Time: ${localTime}</p>
        <p style="font-size:12px;color:#94a3b8;">Source: OpenWeather</p>
      `;

    } catch {
      result.innerHTML = `<p>❌ Location not found (Try: Pune, Mumbai)</p>`;
    }
  }
}

// Enter key support
document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});