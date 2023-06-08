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
      if (document.getElementById('useDaily').checked) {
        if (document.getElementById('resetIndex').checked) {
          console.log('index reset');
          indexNumber = "0";
        }
        getHourlyWeather(latitude, longitude);
        console.log('Called hourly weather');
      } else {
        if (document.getElementById('resetIndex').checked) {
          console.log('index reset');
          indexNumber = "0";
        }
        getWeather(latitude, longitude);
        console.log('Called default weather');
      }
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

  const weatherForecast = document.getElementById('weather');
  const city = document.getElementById(`city`);
  const state = document.getElementById(`state`);
  const alerts = document.getElementById(`weatherAlerts`);
  const temperature = document.getElementById(`temperature`);
  const winds = document.getElementById(`winds`);
  const rainChance = document.getElementById(`rainChance`);
  const icon = document.getElementById(`weatherIcon`);
  const shortForecast = document.getElementById(`shortForecast`);
  const weatherValidTime = document.getElementById(`weatherValidTime`);
  const forecastFor = document.getElementById(`weatherFor`);
  const feelsLIke = document.getElementById(`feelsLike`);
  const futureForecast = document.getElementById("futurePeriods");
  let iconImage = "";
  const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  console.log(indexNumber);
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
          futureForecast.innerHTML = "";
          for (let i = 0; i < futurePeriodsLength; i++) {
            const options = data2.properties.periods[i].name;
            const option = document.createElement("option");
            option.text = options;
            option.value = i;
            futureForecast.appendChild(option);
          }
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
function getHourlyWeather(latitude, longitude) {
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
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      city.innerHTML = ` City = ${data.properties.relativeLocation.properties.city}`;
      state.innerHTML = ` State = ${data.properties.relativeLocation.properties.state}`;

      const weatherAlerts = `https://api.weather.gov/alerts/active?area=${data.properties.relativeLocation.properties.state}`;
      const testWeatherAlert =`https://api.weather.gov/alerts/active?area=NM`
      fetch(weatherAlerts)
        .then((response) => response.json())
        .then((alertData) => {
          console.log(alertData);
          const alertTime = alertData.updated;
          console.log(alertTime);
          const correctTime = new Date(alertTime);
          const readableDateTime = correctTime.toISOString();
          console.log(readableDateTime);
          alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
          console.log(alertData.features.length);
          if (
            alertData.features.length > 0 &&
            alertData.features[0].properties.headline != undefined
          ) {
            if (alertData.features.length > 0) {
              alerts.innerHTML = ""; // Clear any existing content before appending new alerts
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

      fetch(data.properties.forecastHourly)
        .then((response) => response.json())
        .then((data2) => {
          console.log(data2);
          console.log(data2.properties.periods[indexNumber].probabilityOfPrecipitation.value);
          const dateString = `${data2.properties.periods[indexNumber].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
          const formattedDate = date.toLocaleString(undefined, options);
          console.log(formattedDate);
          console.log(data2.properties.periods[indexNumber].icon);
          const link = data2.properties.periods[0].icon;
          // Change "small" to "medium" in the link
          let modifiedLink = link.replace("size=small", "size=medium");
          console.log(modifiedLink);
          document.getElementById("weatherImage").src = modifiedLink;
          weatherValidTime.innerHTML = `This forecast is valid until ${formattedDate} `;
          const direction = `${data2.properties.periods[indexNumber].windDirection}`;
          console.log(direction);
          const futurePeriodsLength = data2.properties.periods.length;
          console.log(futurePeriodsLength);
          windForecast.innerHTML = `${data2.properties.periods[indexNumber].windSpeed} ${direction}`;
          temperature.innerHTML = `${data2.properties.periods[indexNumber].temperature}°${data2.properties.periods[0].temperatureUnit}`;
          shortForecast.innerHTML = `${data2.properties.periods[indexNumber].shortForecast}`;
          const dateString2 = `${data2.properties.periods[indexNumber].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          };
          const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
          console.log(formattedDate2);
          forecastFor.innerHTML = `Forecast for ${formattedDate2}`;
          var temperatureInput = data2.properties.periods[indexNumber].temperature;
          var humidity1 = data2.properties.periods[indexNumber].relativeHumidity.value;
          var humidity = humidity1 / 100;
          if (data2.properties.periods[indexNumber].probabilityOfPrecipitation.value != null) {
            rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber].probabilityOfPrecipitation.value}`;
            // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
          }
          else{
            rainChanceIcon.innerHTML = `0`;
          }
          var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
          console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
          feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
          futureForecast.innerHTML = "";
          for (let i = 0; i < futurePeriodsLength; i++) {
            const dateStart = data2.properties.periods[i].startTime;
            const date2 = new Date(dateStart);
            const options2 = {
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            };
            const formattedDate2 = date2.toLocaleString(undefined, options2).replace(',', ',');
            console.log(formattedDate2);
            const options = `Forecast for ${formattedDate2}`;
            const option = document.createElement("option");
            option.text = options;
            option.value = i;
            futureForecast.appendChild(option);
          }
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
 function off() {
   document.getElementById("overlay").style.display = "none";
   document.getElementById("mainContent").style.display = "unset";
   const weatrherContent = document.getElementById("weatherContent");
   weatrherContent.classList.remove("hidden");
 }
 function on() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("mainContent").style.display = "none";
  const buttonShow = document.getElementById("showWeather");
  if(isDarkMode == true)
  {
    document.getElementById("overlay").style.backgroundColor = "black";
    document.getElementById("settings").style.color = "white";
    document.getElementById("daily").style.color = "white";
    document.getElementById("showWeather").style.color = "white";
   buttonShow.classList.add("btn-outline-dark");
  }
  else{
    document.getElementById("overlay").style.backgroundColor = "white";
    document.getElementById("settings").style.color = "black";
    document.getElementById("daily").style.color = "black";
    document.getElementById("showWeather").style.color = "black";
    buttonShow.classList.add("btn-outline-light");
  }
} 
function getFutureForecast(){
  indexNumber = "0";
  alert(indexNumber);
  var futurePeriods = document.getElementById("futurePeriods");
  var selectedValue = futurePeriods.value;
  indexNumber = selectedValue;
  alert(indexNumber);
  document.getElementById(`resetIndex`).checked.false;
  getLocation();
}