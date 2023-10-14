document.addEventListener("DOMContentLoaded", () => {
let container = document.getElementById("container");
const header = document.getElementById("header");
const typeTemp = document.getElementById("typeTemp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weather = document.getElementById("weatherDescription");
const weatherImg = document.getElementById("weatherImg");
const weatherMain = document.getElementById("weatherText");
const fiveDaysForecastElement = document.getElementById("fiveDaysForecast");
const search = document.getElementById("search");
const searchbtn = document.getElementById("searchbtn");

//Weather Api
const APIKey = "496c5252f6db6014138471f722aa58d4";

// Function to fetch data in Stockholm
const fetchStockholmWeather = async () => {
  let stockholmUrl = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${APIKey}`;

  await fetch(stockholmUrl)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      const cityName = json.name;
      console.log("city:", cityName);
      const temp = json.main.temp;
      const tempRounded = Math.round(temp * 10) / 10;
      console.log("temp:", tempRounded);
      const weather = json.weather[0].description;
      console.log("type:", weather);

      // Convert sunrise unix time to hours & minutes
      const sunriseTime = new Date(json.sys.sunrise * 1000);
      const sunriseHour = sunriseTime
        .getHours()
        .toLocaleString("en-US", { minimumIntegerDigits: 2 });
      console.log(sunriseHour);
      const sunriseMinutes = sunriseTime
        .getMinutes()
        .toLocaleString("en-US", { minimumIntegerDigits: 2 });
      console.log(sunriseMinutes);

      // Convert sunset unix time to hours & minutes
      const sunsetTime = new Date(json.sys.sunset * 1000);
      const sunsetHour = sunsetTime
        .getHours()
        .toLocaleString("en-US", { minimumIntegerDigits: 2 });
      console.log(sunsetHour);
      const sunsetMinutes = sunsetTime
        .getMinutes()
        .toLocaleString("en-US", { minimumIntegerDigits: 2 });
      console.log(sunsetMinutes);

      //display image depending on weather type
      const weatherMain = json.weather[0].main;
      console.log(weatherMain);
      switch (weatherMain) {
        case "Clear":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/sunnies.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>Light a fire and get cosy. ${cityName} is looking grey today</h2>`;
          container.classList.toggle("container-clear");
          break;
        case "Clouds":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/cloud.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>The sky is 50 shades of grey in ${cityName}. </h2>`;
          container.classList.toggle("container-cloudy");
          break;
        case "Rain":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/umbrella.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>Don't forget your umbrella. It's wet in ${cityName} today. </h2>`;
          container.classList.toggle("container-rainy");
          break;
        case "Snow":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/snowflake.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>Don't forget your winter coat. It's snowy in ${cityName} today.</h2>`;
          container.classList.toggle("container-snowy");
          break;
        default:
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/sunnies.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>Get your sunnies on. ${cityName} is looking rather great today. </h2>`;
          break;
      }

      // Display values in DOM
      typeTemp.innerHTML = `
        <h3>${weather} | ${tempRounded}&deg</h3>
      `;
      sunrise.innerHTML = `
        <h3>sunrise = ${sunriseHour}:${sunriseMinutes}</h3>
      `;
      sunset.innerHTML = `
        <h3>sunset = ${sunsetHour}:${sunsetMinutes}</h3>
      `;
    })
    .catch((err) => console.log(err));
};

// Function to fetch data in Stockholm
const fetchForecast = async () => {
  let stockholmUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${APIKey}`;

  await fetch(stockholmUrl)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log("forecast:");
      console.log(json);

      //Finding the min and max temperature for each day
      const dailyTemperatures = json.list.reduce((result, item) => {
        const date = item.dt_txt.split(" ")[0];
        const temperature = item.main.temp;

        //convert temperature to 1 decimal
        const temperatureRounded = Math.round(temperature * 10) / 10;
        //console.log(date," : ", temperature);

        if (!result[date]) {
          result[date] = { min: temperatureRounded, max: temperatureRounded };
        } else {
          if (temperatureRounded < result[date].min) {
            result[date].min = temperatureRounded;
          }
          if (temperatureRounded > result[date].max) {
            result[date].max = temperatureRounded;
          }
        }
        return result;
      }, {});
      console.log(dailyTemperatures);

      // Display values in DOM
      fiveDaysForecast.innerHTML = "";

      for (const date in dailyTemperatures) {
        const weekday = new Date(date).toLocaleString("en-US", {
          weekday: "long",
        });
        const minTemp = dailyTemperatures[date].min;
        const maxTemp = dailyTemperatures[date].max;

        fiveDaysForecast.innerHTML += `
      <div id="forecastSection" class="forecast-section">
      
      <div id="weekdaysection" class="weekday-section">
      <h3> ${weekday} </h3>
      </div>
      
      <div id="temperature" class="temperature">
      <h3>min: ${minTemp}&deg | max ${maxTemp}&deg</h3>
      </div>
      
      </div>
      `;
      }
    })
    .catch((err) => console.log(err));
};

fetchStockholmWeather();
fetchForecast();

// forecast informatıon after search
searchbtn.addEventListener("click", () => {
  const cityName = search.value;
    weatherDescription.innerHTML = ``;
    weatherMain.innerHTML = ``;
    weatherImg.innerHTML = ``;
    typeTemp.innerHTML.innerHTML = ``;
    sunrise.innerHTML.innerHTML = ``;
    sunset.innerHTML.innerHTML = ``;
    fiveDaysForecastElement.innerHTML.innerHTML = ``;

  if (cityName) {
    console.log(cityName);
    getWeatherInfo(cityName);
    getForecastInfo(cityName);
  }
});

//enter a basınca da hava durumu bilgisini al
search.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    weatherDescription.innerHTML = ``;
    weatherMain.innerHTML = ``;
    weatherImg.innerHTML = ``;
    typeTemp.innerHTML.innerHTML = ``;
    sunrise.innerHTML.innerHTML = ``;
    sunset.innerHTML.innerHTML = ``;
    fiveDaysForecastElement.innerHTML.innerHTML = ``;
    searchbtn.click();
  }
});

function clearInputText() {
  const inputElement = document.getElementById("search");
  inputElement.value = "";
}

const clearButton = document.getElementById("clearbtn");
  clearButton.addEventListener("click", clearInputText);

async function getWeatherInfo(cityName) {
  try {
    // Fetch weather data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${APIKey}`
    );
    const data = await response.json();
    const city = data.name;
    console.log("city:", city);
    const temp = data.main.temp;
    const tempRounded = Math.round(temp * 10) / 10;
    console.log("temp:", tempRounded);
    const weather = data.weather[0].main;
    console.log("type:", weather);

    // Convert sunrise unix time to hours & minutes
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunriseHour = sunriseTime
      .getHours()
      .toLocaleString("en-US", { minimumIntegerDigits: 2 });
    console.log(sunriseHour);
    const sunriseMinutes = sunriseTime
      .getMinutes()
      .toLocaleString("en-US", { minimumIntegerDigits: 2 });
    console.log(sunriseMinutes);

    // Convert sunset unix time to hours & minutes
    const sunsetTime = new Date(data.sys.sunset * 1000);
    const sunsetHour = sunsetTime
      .getHours()
      .toLocaleString("en-US", { minimumIntegerDigits: 2 });
    console.log(sunsetHour);
    const sunsetMinutes = sunsetTime
      .getMinutes()
      .toLocaleString("en-US", { minimumIntegerDigits: 2 });
    console.log(sunsetMinutes);

    // Update DOM
    console.log("data:");
    console.log(data);

    //display image depending on weather type
    const weatherMain = data.weather[0].main;
    console.log(weatherMain);
    switch (weatherMain) {
      case "Clear":
        weatherImg.innerHTML = `
                <img src="./design/design2/icons/sunnies.svg" />`;
        weatherDescription.innerHTML += `
                <h2>Light a fire and get cosy. ${city} is looking grey today</h2>`;
        container.classList.toggle("container-clear");
        break;
      case "Clouds":
        weatherImg.innerHTML = `
                <img src="./design/design2/icons/cloud.svg" />`;
        weatherDescription.innerHTML += `
                <h2>The sky is 50 shades of grey in ${city}. </h2>`;
        container.classList.toggle("container-cloudy");
        break;
      case "Rain":
        weatherImg.innerHTML = `
                <img src="./design/design2/icons/umbrella.svg" />`;
        weatherDescription.innerHTML += `
                <h2>Don't forget your umbrella. It's wet in ${city} today. </h2>`;
        container.classList.toggle("container-rainy");
        break;
      case "Snow":
        weatherImg.innerHTML = `
                <img src="./design/design2/icons/snowflake.svg" />`;
        weatherDescription.innerHTML += `
                <h2>Don't forget your winter coat. It's snowy in ${city} today.</h2>`;
        container.classList.toggle("container-snowy");
        break;
      default:
        weatherImg.innerHTML = `
                <img src="./design/design2/icons/sunnies.svg" />`;
        weatherDescription.innerHTML += `
                <h2>Get your sunnies on. ${city} is looking rather great today. </h2>`;
        break;
    }

    // Display values in DOM
    typeTemp.innerHTML = `
    <h3>${weather} | ${tempRounded}&deg</h3>
  `;
  sunrise.innerHTML = `
    <h3>sunrise =  ${sunriseHour}:${sunriseMinutes}</h3>
  `;
  sunset.innerHTML = `
    <h3>sunset =  ${sunsetHour}:${sunsetMinutes}</h3>
  `;


  } catch (error) {
    console.error("Weather information could not be retrieved: " + error);
    alert(
      "Weather information could not be obtained. Please enter a valid city name."
    );
  }
}

const getForecastInfo = async (cityName) => {
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${APIKey}`;

  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log("forecast:");
      console.log(json);

      //Finding the min and max temperature for each day
      const dailyTemperatures = json.list.reduce((result, item) => {
        const date = item.dt_txt.split(" ")[0];
        const temperature = item.main.temp;

        //convert temperature to 1 decimal
        const temperatureRounded = Math.round(temperature * 10) / 10;
        //console.log(date," : ", temperature);

        if (!result[date]) {
          result[date] = { min: temperatureRounded, max: temperatureRounded };
        } else {
          if (temperatureRounded < result[date].min) {
            result[date].min = temperatureRounded;
          }
          if (temperatureRounded > result[date].max) {
            result[date].max = temperatureRounded;
          }
        }
        return result;
      }, {});
      console.log(dailyTemperatures);

      // Display values in DOM
      fiveDaysForecast.innerHTML = "";

      for (const date in dailyTemperatures) {
        const weekday = new Date(date).toLocaleString("en-US", {
          weekday: "long",
        });
        const minTemp = dailyTemperatures[date].min;
        const maxTemp = dailyTemperatures[date].max;

        fiveDaysForecast.innerHTML += `
      <div id="forecastSection" class="forecast-section">
      
      <div id="weekdaysection" class="weekday-section">
      <h3> ${weekday} </h3>
      </div>
      
      <div id="temperature" class="temperature">
      <h3>min: ${minTemp}&deg | max ${maxTemp}&deg</h3>
      </div>
      
      </div>
      `;
      }
    })
}});
