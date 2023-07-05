// Declare variables
let latitude;
let longitude;
const alertTitle = document.getElementById("alertTitle");
const pictureSize = "medium";
var temperatureInput= "";
var humidity1 = "";
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log(isDarkMode);
const rainChanceIcon = document.getElementById("rainChanceIcon");
const windForecast = document.getElementById("windForecast");
const windDirection = document.getElementById("windDirection");
let indexNumber = 0;
function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // Callback function to handle successful retrieval of location data
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      alertTitle.style.display = "block";
      // Call getWeather function after the location is retrieved
      // if (document.getElementById('useDaily').checked) {
      //   if (document.getElementById('resetIndex').checked) {
      //     console.log('index reset');
      //     indexNumber = "0";
      //   }
      //   getHourlyWeather(latitude, longitude);
      //   console.log('Called hourly weather');
      // } else {
      //   if (document.getElementById('resetIndex').checked) {
      //     console.log('index reset');
      //     indexNumber = "0";
      //   }
      //   getWeather(latitude, longitude);
      //   console.log('Called default weather');
      // }
        getWeather(latitude,longitude);
        getHourlyWeather(latitude,longitude);
        getHourlyWeather2(latitude,longitude);
        getHourlyWeather3(latitude,longitude);
    }, function() {
      // Callback function to handle errors
      alert(`Unable to retrieve location`);
    });
  } else {
    alert(`Geolocation is not supported by this browser`);
  }
}

// Fetch the weather data based on the latitude and longitude
function getWeather(latitude, longitude) {
  const weatherForecast = document.getElementById("weather");
const city = document.getElementById("city");
const state = document.getElementById("state");
const alerts = document.getElementById("weatherAlerts");
const temperature = document.getElementById("temperature");
const winds = document.getElementById("winds");
const rainChance = document.getElementById("rainChance");
const icon = document.getElementById("weatherIcon");
const shortForecast = document.getElementById("shortForecast");
const weatherValidTime = document.getElementById("weatherValidTime");
const forecastFor = document.getElementById("weatherFor");
const feelsLIke = document.getElementById(`feelsLike`);
let iconImage = "";
const futureForecast = document.getElementById("futurePeriods");
const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  fetch(weatherdata)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      city.innerHTML = ` City = ${data.properties.relativeLocation.properties.city}`;
      state.innerHTML = ` State = ${data.properties.relativeLocation.properties.state}`;
      
      const weatherAlerts = `https://api.weather.gov/alerts/active?area=${data.properties.relativeLocation.properties.state}`;
      
      fetch(weatherAlerts)
        .then(response => response.json())
        .then(alertData => {
          console.log(alertData);
          const alertTime = alertData.updated;
          console.log(alertTime);
          const correctTime = new Date(alertTime);
          const readableDateTime = correctTime.toISOString();
          console.log(readableDateTime);
          alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
          console.log(alertData.features.length);
          if(alertData.features.length > 0 && alertData.features[indexNumber].properties.headline != undefined) {
            if (alertData.features.length > 0) {
              alerts.innerHTML = ''; // Clear any existing content before appending new alerts
              for (let i = 0; i < alertData.features.length; i++) {
                const activeAlerts = alertData.features[i].properties.headline;
                const alertDescription = alertData.features[i].properties.description;
                const areaDescription = alertData.features[i].properties.areaDesc;
                alerts.innerHTML += activeAlerts + `<br>`;
                alerts.innerHTML += `Applicable to: ` + areaDescription + `<br>`;
                alerts.innerHTML += alertDescription + `<br>`;
                alerts.classList.add('alert');
                alerts.classList.add('alert-info');        
              }
            } else {
              alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
            }
          }            
        });
        
      fetch(data.properties.forecast)
        .then(response => response.json())
        .then(data2 => {
          console.log(data2);
          console.log(data2.properties.periods[indexNumber].probabilityOfPrecipitation.value);
           const isDaytime = data2.properties.periods[indexNumber].isDaytime;
           console.log(data2.properties.periods[indexNumber].isDaytime)
           const futurePeriodsLength = data2.properties.periods.length;
          console.log(futurePeriodsLength);
          const dateString = `${data2.properties.periods[indexNumber].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedDate = date.toLocaleString(undefined, options);
            console.log(formattedDate);
            console.log(data2.properties.periods[indexNumber].icon);
          weatherValidTime.innerHTML = `This forecest is valid until ${formattedDate} `;
          const direction = `${data2.properties.periods[indexNumber].windDirection}`;
          console.log(direction);
          windForecast.innerHTML = `${data2.properties.periods[indexNumber].windSpeed} ${direction}`;
          temperature.innerHTML = `${data2.properties.periods[indexNumber].temperature}°${data2.properties.periods[0].temperatureUnit}` ;
          shortForecast.innerHTML = `${data2.properties.periods[indexNumber].shortForecast}`;
          document.getElementById(`weatherImage`).src = `${data2.properties.periods[0].icon}`;
          const dateString2 = `${data2.properties.periods[indexNumber].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {hour: 'numeric', minute: 'numeric'};
            const formattedDate2 = date2.toLocaleString(undefined, options2);
            console.log(formattedDate2);
          forecastFor.innerHTML = `${data2.properties.periods[indexNumber].name}'s forecast`;
          var temperatureInput = data2.properties.periods[indexNumber].temperature;
          var humidity1 = data2.properties.periods[indexNumber].relativeHumidity.value;
          var humidity = humidity1 / 100;
          if(data2.properties.periods[indexNumber].probabilityOfPrecipitation.value != null)
          {
            rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber].probabilityOfPrecipitation.value}`;
            // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
          }
          else{
            rainChanceIcon.innerHTML = `0`;
          }
          var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
          console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
          feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
          // futureForecast.innerHTML = "";
          // for (let i = 0; i < futurePeriodsLength; i++) {
          //     const dateStart = data2.properties.periods[i].startTime;
          //   const date2 = new Date(dateStart);
          //   const options2 = {
          //     month: 'long',
          //     day: 'numeric',
          //     hour: 'numeric',
          //     minute: 'numeric'
          //   };
          //   const options = data2.properties.periods[i].name;
          //   const option = document.createElement("option");
          //   option.text = options;
          //   option.value = i;
          //   futureForecast.appendChild(option);
          // }
        });
    });
    console.log(indexNumber)
}

// Function to calculate the feels like temperature based on relative humidity
function calculateFeelsLikeTemperature(temperatureF, humidity) {
  // Calculate the feels like temperature
  var feelsLikeTemperature =
    temperatureF +
    0.33 * humidity -
    0.70 * Math.pow(10, -3) * Math.pow(temperatureF, 2) -
    4.00 * Math.pow(10, -6) * Math.pow(humidity, 2) +
    0.75 * Math.pow(10, -3) * Math.pow(temperatureF, 2) * humidity;

  return feelsLikeTemperature;

  
}
function getHourlyWeather(latitude, longitude) {
  indexNumber1 = indexNumber + 1;
  console.log(indexNumber1)
  const weatherForecast = document.getElementById("weather");
const temperature = document.getElementById("temperature1");
const winds = document.getElementById("winds");
const rainChance = document.getElementById("rainChance");
const icon = document.getElementById("weatherIcon");
const shortForecast = document.getElementById("shortForecast1");
// const weatherValidTime = document.getElementById("weatherValidTime");
const forecastFor = document.getElementById("weatherFor1");
const feelsLIke = document.getElementById(`feelsLike`);
const rainChanceIcon = document.getElementById("rainChanceIcon1");
const windForecast = document.getElementById("windForecast1");
let iconImage = "";
const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  fetch(weatherdata)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetch(data.properties.forecastHourly)
        .then((response) => response.json())
        .then((data2) => {
          console.log(data2);
          const dateString = `${data2.properties.periods[indexNumber1].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          const formattedDate = date.toLocaleString(undefined, options);
          console.log(formattedDate);
          console.log(data2.properties.periods[indexNumber1].icon);
          const link = data2.properties.periods[indexNumber1].icon;
          // Change "small" to "medium" in the link
          let modifiedLink = link.replace("size=small", "size=medium");
          console.log(modifiedLink);
          document.getElementById("weatherImage1").src = modifiedLink;
          // weatherValidTime.innerHTML = `This forecast is valid until ${formattedDate} `;
          const direction = `${data2.properties.periods[indexNumber1].windDirection}`;
          console.log(direction);
          // const futurePeriodsLength = data2.properties.periods.length;
          // console.log(futurePeriodsLength);
          windForecast.innerHTML = `${data2.properties.periods[indexNumber1].windSpeed} ${direction}`;
          temperature.innerHTML = `${data2.properties.periods[indexNumber1].temperature}°${data2.properties.periods[0].temperatureUnit}`;
          shortForecast.innerHTML = `${data2.properties.periods[indexNumber1].shortForecast}`;
          const dateString2 = `${data2.properties.periods[indexNumber1].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {
            hour: 'numeric',
            minute: 'numeric'
          };
          const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          console.log(formattedDate2);
          forecastFor.innerHTML = `${formattedDate2}'s forecast`;
          var temperatureInput = data2.properties.periods[indexNumber1].temperature;
          var humidity1 = data2.properties.periods[indexNumber1].relativeHumidity.value;
          var humidity = humidity1 / 100;
          if (data2.properties.periods[indexNumber1].probabilityOfPrecipitation.value != null) {
            rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber1].probabilityOfPrecipitation.value}`;
            // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
          }
          else{
            rainChanceIcon.innerHTML = `0`;
          }
          var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
          console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
          feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
          // futureForecast.innerHTML = "";
          // for (let i = 0; i < futurePeriodsLength; i++) {
          //   const dateStart = data2.properties.periods[i].startTime;
          //   const date2 = new Date(dateStart);
          //   const options2 = {
          //     month: 'long',
          //     day: 'numeric',
          //     hour: 'numeric',
          //     minute: 'numeric'
          //   };
          //   const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          //   console.log(formattedDate2);
          //   const options = `Forecast for ${formattedDate2}`;
          //   const option = document.createElement("option");
          //   option.text = options;
          //   option.value = i;
          //   futureForecast.appendChild(option);
          // }
        });
    });
}
function getHourlyWeather2(latitude, longitude) {
  indexNumber2 = indexNumber + 2;
  console.log(indexNumber2);
  const weatherForecast = document.getElementById("weather");
const alerts = document.getElementById("weatherAlerts");
const temperature = document.getElementById("temperature2");
const winds = document.getElementById("winds");
const rainChance = document.getElementById("rainChance");
const icon = document.getElementById("weatherIcon");
const shortForecast = document.getElementById("shortForecast2");
// const weatherValidTime = document.getElementById("weatherValidTime");
const forecastFor = document.getElementById("weatherFor2");
const feelsLIke = document.getElementById(`feelsLike`);
const rainChanceIcon = document.getElementById("rainChanceIcon2");
const windForecast = document.getElementById("windForecast2");
let iconImage = "";
const futureForecast = document.getElementById("futurePeriods");
const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  fetch(weatherdata)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetch(data.properties.forecastHourly)
        .then((response) => response.json())
        .then((data2) => {
          console.log(data2);
          const dateString = `${data2.properties.periods[indexNumber2].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          const formattedDate = date.toLocaleString(undefined, options);
          console.log(formattedDate);
          console.log(data2.properties.periods[indexNumber2].icon);
          const link = data2.properties.periods[indexNumber2].icon;
          // Change "small" to "medium" in the link
          let modifiedLink = link.replace("size=small", "size=medium");
          console.log(modifiedLink);
          document.getElementById("weatherImage2").src = modifiedLink;
          // weatherValidTime.innerHTML = `This forecast is valid until ${formattedDate} `;
          const direction = `${data2.properties.periods[indexNumber2].windDirection}`;
          console.log(direction);
          // const futurePeriodsLength = data2.properties.periods.length;
          // console.log(futurePeriodsLength);
          windForecast.innerHTML = `${data2.properties.periods[indexNumber2].windSpeed} ${direction}`;
          temperature.innerHTML = `${data2.properties.periods[indexNumber2].temperature}°${data2.properties.periods[0].temperatureUnit}`;
          shortForecast.innerHTML = `${data2.properties.periods[indexNumber2].shortForecast}`;
          const dateString2 = `${data2.properties.periods[indexNumber2].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {
            hour: 'numeric',
            minute: 'numeric'
          };
          const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          console.log(formattedDate2);
          forecastFor.innerHTML = `${formattedDate2}'s forecast`;          var temperatureInput = data2.properties.periods[1].temperature;
          var humidity1 = data2.properties.periods[indexNumber2].relativeHumidity.value;
          var humidity = humidity1 / 100;
          if (data2.properties.periods[indexNumber2].probabilityOfPrecipitation.value != null) {
            rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber2].probabilityOfPrecipitation.value}`;
            // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
          }
          else{
            rainChanceIcon.innerHTML = `0`;
          }
          var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
          console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
          feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
          // futureForecast.innerHTML = "";
          // for (let i = 0; i < futurePeriodsLength; i++) {
          //   const dateStart = data2.properties.periods[i].startTime;
          //   const date2 = new Date(dateStart);
          //   const options2 = {
          //     month: 'long',
          //     day: 'numeric',
          //     hour: 'numeric',
          //     minute: 'numeric'
          //   };
          //   const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          //   console.log(formattedDate2);
          //   const options = `Forecast for ${formattedDate2}`;
          //   const option = document.createElement("option");
          //   option.text = options;
          //   option.value = i;
          //   futureForecast.appendChild(option);
          // }
        });
    });
}

function getHourlyWeather3(latitude, longitude) {
  indexNumber3 = indexNumber + 3;
  console.log(indexNumber3);
  const weatherForecast = document.getElementById("weather");
const alerts = document.getElementById("weatherAlerts");
const temperature = document.getElementById("temperature3");
const winds = document.getElementById("winds");
const rainChance = document.getElementById("rainChance");
const icon = document.getElementById("weatherIcon");
const shortForecast = document.getElementById("shortForecast3");
// const weatherValidTime = document.getElementById("weatherValidTime");
const forecastFor = document.getElementById("weatherFor3");
const feelsLIke = document.getElementById(`feelsLike`);
const rainChanceIcon = document.getElementById("rainChanceIcon3");
const windForecast = document.getElementById("windForecast3");
let iconImage = "";
const futureForecast = document.getElementById("futurePeriods");
const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  fetch(weatherdata)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fetch(data.properties.forecastHourly)
        .then((response) => response.json())
        .then((data2) => {
          console.log(data2);
          const dateString = `${data2.properties.periods[indexNumber3].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          const formattedDate = date.toLocaleString(undefined, options);
          console.log(formattedDate);
          console.log(data2.properties.periods[indexNumber3].icon);
          const link = data2.properties.periods[indexNumber3].icon;
          // Change "small" to "medium" in the link
          let modifiedLink = link.replace("size=small", "size=medium");
          console.log(modifiedLink);
          document.getElementById("weatherImage3").src = modifiedLink;
          // weatherValidTime.innerHTML = `This forecast is valid until ${formattedDate} `;
          const direction = `${data2.properties.periods[indexNumber3].windDirection}`;
          console.log(direction);
          // const futurePeriodsLength = data2.properties.periods.length;
          // console.log(futurePeriodsLength);
          windForecast.innerHTML = `${data2.properties.periods[indexNumber3].windSpeed} ${direction}`;
          temperature.innerHTML = `${data2.properties.periods[indexNumber3].temperature}°${data2.properties.periods[0].temperatureUnit}`;
          shortForecast.innerHTML = `${data2.properties.periods[indexNumber3].shortForecast}`;
          const dateString2 = `${data2.properties.periods[indexNumber3].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {
            hour: 'numeric',
            minute: 'numeric'
          };
          const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          console.log(formattedDate2);
          forecastFor.innerHTML = `${formattedDate2}'s forecast`;          var temperatureInput = data2.properties.periods[1].temperature;
          var temperatureInput = data2.properties.periods[indexNumber3].temperature;
          var humidity1 = data2.properties.periods[indexNumber3].relativeHumidity.value;
          var humidity = humidity1 / 100;
          if (data2.properties.periods[indexNumber3].probabilityOfPrecipitation.value != null) {
            rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber3].probabilityOfPrecipitation.value}`;
            // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
          }
          else{
            rainChanceIcon.innerHTML = `0`;
          }
          var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
          console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
          feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
          // futureForecast.innerHTML = "";
          // for (let i = 0; i < futurePeriodsLength; i++) {
          //   const dateStart = data2.properties.periods[i].startTime;
          //   const date2 = new Date(dateStart);
          //   const options2 = {
          //     month: 'long',
          //     day: 'numeric',
          //     hour: 'numeric',
          //     minute: 'numeric'
          //   };
          //   const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          //   console.log(formattedDate2);
          //   const options = `Forecast for ${formattedDate2}`;
          //   const option = document.createElement("option");
          //   option.text = options;
          //   option.value = i;
          //   futureForecast.appendChild(option);
          // }
        });
    });
}

// Function to calculate the feels like temperature based on relative humidity
function calculateFeelsLikeTemperature(temperatureF, humidity) {
  // Calculate the feels like temperature
  var feelsLikeTemperature =
    temperatureF +
    0.33 * humidity -
    0.70 * Math.pow(10, -3) * Math.pow(temperatureF, 2) -
    4.00 * Math.pow(10, -6) * Math.pow(humidity, 2) +
    0.75 * Math.pow(10, -3) * Math.pow(temperatureF, 2) * humidity;

  return feelsLikeTemperature;
}

 function removeBorder() {
 var container = document.getElementById("imageContainer");
 container.classList.remove("hidden");
 }
 function showReloadButton(){
  var reloadBUtton = document.getElementById("reloadWeather");
 reloadBUtton.classList.remove("hidden");
 }
 function on() {
  const weatherContent = document.getElementById("weatherContent");
  weatherContent.classList.remove("hidden");
  if(isDarkMode == true)
  {
    weatherContent.style.backgroundColor = "#1E1E1E";
    weatherContent.style.border = "2px solid white";
    weatherContent.style.boxShadow = "0px 13px 28px 8px rgba(255,255,255,1)";
    weatherContent.style.color = "#FFFFFF";
    document.body.style.backgroundColor = "#1E1E1E";
    document.body.style.color = "#FFFFFF";
   getLocation();
  }
  else{
    weatherContent.style.backgroundColor = "	#e4e5f1";
    weatherContent.style.border = "2px solid black";
    weatherContent.style.boxShadow = "0px 13px 28px 8px rgba(0,0,0,1)";
    weatherContent.style.color = "#333333";
    document.body.style.backgroundColor = "#d2d3db";
    document.body.style.color = "#333333";
        getLocation();
  }
} 
function getFutureForecast(){
  var futurePeriods = document.getElementById("futurePeriods");
  var selectedValue = futurePeriods.value;
  indexNumber = selectedValue;
  alert(selectedValue);
    getLocation();
}