const container = document.getElementById("container");
const header = document.getElementById("header");
const typeTemp = document.getElementById("typeTemp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherDescription = document.getElementById("weatherDescription");
const weatherImg = document.getElementById("weatherImg");
const fiveDaysForecast = document.getElementById("fiveDaysForecast");

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
      const city = json.name;
      console.log("city:", city);
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
                  <h2>The sky is 50 shades of grey in ${json.name}. </h2>`;
          break;
        case "Clouds":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/cloud.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>The sky is 50 shades of grey in ${json.name}. </h2>`;
          break;
        case "Rain":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/umbrella.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>The sky is 50 shades of grey in ${json.name}. </h2>`;
          break;
        case "Snow":
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/snowflake.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>The sky is 50 shades of grey in ${json.name}. </h2>`;
          break;
        default:
          weatherImg.innerHTML = `
                  <img src="./design/design2/icons/sunnies.svg" />`;
          weatherDescription.innerHTML += `
                  <h2>The sky is 50 shades of grey in ${json.name}. </h2>`;
          break;
      }

      // Display image depending on weather type
      //const weatherId = json.weather[0].id;
      //console.log(weatherId);
      //if (weatherId > 800) {
      //  weatherImg.innerHTML = `
      //    <img src="./design/design2/icons/cloud.svg" />
      //  `
      //} else if (weatherId = 800) {
      //  weatherImg.innerHTML = `
      //    <img src="./design/design2/icons/sunnies.svg" />
      //  `
      //} else if (weatherId > 700) {
      //  weatherImg.innerHTML = `
      //    <img src="./design/design2/icons/cloud.svg" />
      //  `
      //} else {
      //  weatherImg.innerHTML = `
      //    <img src="./design/design2/icons/umbrella.svg" />
      //  `
      //}

      // Display values in DOM
      typeTemp.innerHTML = `
        <h3>${weather} | ${tempRounded}&deg</h3>
      `;
      sunrise.innerHTML = `
        <h3>sunrise ${sunriseHour}:${sunriseMinutes}</h3>
      `;
      sunset.innerHTML = `
        <h3>sunset ${sunsetHour}:${sunsetMinutes}</h3>
      `;
    })
    .catch((err) => console.log(err));
};

fetchStockholmWeather();

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
                    <h3>Min: ${minTemp}&deg | Max ${maxTemp}&deg</h3>
                    </div>

                </div>
                `;

      }
    })
    .catch((err) => console.log(err));
};

fetchForecast();
