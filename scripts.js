// Declare variables
let latitude;
let longitude;
const alertTitle = document.getElementById("alertTitle");
function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // Callback function to handle successful retrieval of location data
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      alertTitle.style.display = "block";
      // Call getWeather function after the location is retrieved
      if (document.getElementById('useDaily').checked) {
        getHourlyWeather(latitude, longitude);
        console.log(`Called hourly weather`);
    } else {
      getWeather(latitude, longitude);
      console.log(`Called default weather`);
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
  let iconImage = "";
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
          if(alertData.features.length > 0 && alertData.features[0].properties.headline != undefined) {
            if (alertData.features.length > 0) {
              alerts.innerHTML = ''; // Clear any existing content before appending new alerts
              for (let i = 0; i < alertData.features.length; i++) {
                const activeAlerts = alertData.features[i].properties.headline;
                alerts.innerHTML += activeAlerts + `<br>`;
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
          console.log(data2.properties.periods[0].probabilityOfPrecipitation.value);
           const isDaytime = data2.properties.periods[0].isDaytime;
          switch (`${data2.properties.periods[0].probabilityOfPrecipitation.value}`) {
            case "0":
              icon.className = isDaytime ? `wi wi-day-sunny` : `wi wi-night-clear`;
              break;
            default:
              if (parseInt(data2.properties.periods[0].probabilityOfPrecipitation.value) > 0) {
                icon.className = isDaytime ? `wi wi-day-sprinkle` : `wi wi-night-showers`;
              } else {
                icon.className = isDaytime ? `wi wi-day-sunny` : `wi wi-night-clear`;
              }
              break;
          }  
          console.log(data2.properties.periods[0].isDaytime);
          const dateString = `${data2.properties.periods[0].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedDate = date.toLocaleString(undefined, options);
            console.log(formattedDate);
          weatherValidTime.innerHTML = `This forecest is valid until ${formattedDate} `;
          winds.innerHTML = `Winds: ${data2.properties.periods[0].windSpeed} going ${data2.properties.periods[0].windDirection} `;
          temperature.innerHTML = `${data2.properties.periods[0].temperature}°${data2.properties.periods[0].temperatureUnit}` ;
          shortForecast.innerHTML = `${data2.properties.periods[0].shortForecast}`;
          const dateString2 = `${data2.properties.periods[0].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {hour: 'numeric', minute: 'numeric'};
            const formattedDate2 = date2.toLocaleString(undefined, options2);
            console.log(formattedDate2);
          forecastFor.innerHTML = `${data2.properties.periods[0].name}'s forecast`;
          if(data2.properties.periods[0].probabilityOfPrecipitation.value != null)
          {
            rainChance.innerHTML = `Chance of rain: ${data2.properties.periods[0].probabilityOfPrecipitation.value}% chance of rain`;
          }
          else{
            rainChance.innerHTML = `Chance of rain:  0% chance of rain`;
          }
         });
    })
    .catch(error => console.log(error));
}
function getHourlyWeather(latitude, longitude) {
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
  let iconImage = "";
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
          if(alertData.features.length > 0 && alertData.features[0].properties.headline != undefined) {
            if (alertData.features.length > 0) {
              alerts.innerHTML = ''; // Clear any existing content before appending new alerts
            
              for (let i = 0; i < alertData.features.length; i++) {
                const activeAlerts = alertData.features[i].properties.headline;
                alerts.innerHTML += activeAlerts + `<br>`;
              }
            } else {
              alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
            }
          }            
        });
        
      fetch(data.properties.forecastHourly)
        .then(response => response.json())
        .then(data2 => {
          console.log(data2);
          console.log(data2.properties.periods[0].probabilityOfPrecipitation.value);
           const isDaytime = data2.properties.periods[0].isDaytime;
          switch (`${data2.properties.periods[0].probabilityOfPrecipitation.value}`) {
            case "0":
              icon.className = isDaytime ? `wi wi-day-sunny` : `wi wi-night-clear`;
              break;
            default:
              if (parseInt(data2.properties.periods[0].probabilityOfPrecipitation.value) > 0) {
                icon.className = isDaytime ? `wi wi-day-sprinkle` : `wi wi-night-showers`;
              } else {
                icon.className = isDaytime ? `wi wi-day-sunny` : `wi wi-night-clear`;
              }
              break;
          }  
          console.log(data2.properties.periods[0].isDaytime);
          const dateString = `${data2.properties.periods[0].endTime}`;
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formattedDate = date.toLocaleString(undefined, options);
            console.log(formattedDate);
          weatherValidTime.innerHTML = `This forecest is valid until ${formattedDate} `;
          winds.innerHTML = `Winds: ${data2.properties.periods[0].windSpeed} going ${data2.properties.periods[0].windDirection} `;
          temperature.innerHTML = `${data2.properties.periods[0].temperature}°${data2.properties.periods[0].temperatureUnit}` ;
          shortForecast.innerHTML = `${data2.properties.periods[0].shortForecast}`;
          const dateString2 = `${data2.properties.periods[0].startTime}`;
          const date2 = new Date(dateString2);
          const options2 = {hour: 'numeric', minute: 'numeric'};
            const formattedDate2 = date2.toLocaleString(undefined, options2);
            console.log(formattedDate2);
          forecastFor.innerHTML = `${formattedDate2}'s forecast`;
          if(data2.properties.periods[0].probabilityOfPrecipitation.value != null)
          {
            rainChance.innerHTML = `Chance of rain: ${data2.properties.periods[0].probabilityOfPrecipitation.value}% chance of rain`;
          }
          else{
            rainChance.innerHTML = `Chance of rain:  0% chance of rain`;
          }
         });
    })
    .catch(error => console.log(error));
}