const apiKey = "748699d13e9e7e19f331eef2a1d7fbea"; // OpenWeatherMap API key

//local 12-hour time
function getLocalTime(dt, timezone) {
  const localDate = new Date((dt + timezone) * 1000);
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}
//getting weather details 
async function getWeather() {
  const city = document.getElementById("city").value;
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (!city) {
    result.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const localTime = getLocalTime(data.dt, data.timezone);
//Results 
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
    result.innerHTML = `<p>❌ ${err.message}</p>`;
  }
}

