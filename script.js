const container = document.getElementById("container");
const header = document.getElementById("header");
const typeTemp = document.getElementById("typeTemp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherDescription = document.getElementById("weatherDescription");
const weatherImg = document.getElementById("weatherImg");
const fiveDaysForecast = document.getElementById("fiveDaysForecast");
const weatherText = document.getElementById("weatherText");

//Weather Api
const APIKey = "496c5252f6db6014138471f722aa58d4";

// Function to fetch data in Stockholm
const fetchStockholmWeather = async () => {
  let stockholmUrl = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${APIKey}`;

  await fetch(stockholmUrl)
    .then((res)=>{
      return res.json();
    })
    .then(json => {
      console.log(json)
      const cityName = json.name;
      console.log("city:", cityName);
      const temp = json.main.temp;
      const tempRounded = Math.round(temp * 10) / 10;
      console.log("temp:", tempRounded);
      const weather = json.weather[0].description;
      const weatherCapitalize = weather.charAt(0).toUpperCase() + weather.slice(1);
      console.log("type:", weatherCapitalize);

      // Convert sunrise unix time to hours & minutes
      const sunriseTime = new Date(json.sys.sunrise * 1000);
      const sunriseHour = sunriseTime.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2});
      console.log(sunriseHour);
      const sunriseMinutes = sunriseTime.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
      console.log(sunriseMinutes);

      // Convert sunset unix time to hours & minutes
      const sunsetTime = new Date(json.sys.sunset * 1000);
      const sunsetHour = sunsetTime.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2});
      console.log(sunsetHour);
      const sunsetMinutes = sunsetTime.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
      console.log(sunsetMinutes);


      // Display image and text depending on weather type
      let weatherMain = json.weather[0].main;
      console.log(weatherMain);

      switch (weatherMain) {
        case "Clear":
          weatherImg.innerHTML = `
            <img src="./design/design2/icons/sunnies.svg" />`;
          weatherText.innerHTML += `
            <h2>Get your sunnies on. ${cityName} is looking rather great today.</h2>`;
            container.classList.toggle("container-clear");
          break;

        case "Clouds":
          weatherImg.innerHTML = `
            <img src="./design/design2/icons/cloud.svg" />`;
          weatherText.innerHTML += `
            <h2>Light a fire and get cosy. ${cityName} is looking grey today.</h2>`;
            container.classList.toggle("container-cloudy");
          break;

        case "Rain":
          weatherImg.innerHTML = `
            <img src="./design/design2/icons/umbrella.svg" />`;
          weatherText.innerHTML += `
            <h2>Don't forget your umbrella. It's wet in ${cityName} today.</h2>`;
            container.classList.toggle("container-rainy");
          break;

        case "Snow":
          weatherImg.innerHTML = `
            <img src="./design/design2/icons/snowflake.svg" />`;
          weatherText.innerHTML += `
            <h2>Don't forget your winter coat. It's snowy in ${cityName} today.</h2>`;
            container.classList.toggle("container-snowy");
          break;
          
        default:
          weatherImg.innerHTML = `
            <img src="./design/design2/icons/sunnies.svg" />`;
          weatherText.innerHTML += `
            <h2>Get your sunnies on. ${cityName} is looking rather great today. </h2>`;
          break;
      } 
      

      // Display values in DOM
      typeTemp.innerHTML = `
        <p>${weatherCapitalize} | ${tempRounded}&deg</p>
      `
      sunrise.innerHTML = `
        <p>sunrise ${sunriseHour}:${sunriseMinutes}</p>
      `;
      sunset.innerHTML = `
        <p>sunset ${sunsetHour}:${sunsetMinutes}</p>
      `;
    }) 
    .catch((err) => console.log(err));
};

fetchStockholmWeather();