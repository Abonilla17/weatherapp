// Declare variables
let latitude;
let longitude;
const locationData = document.getElementById("locationData");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // Callback function to handle successful retrieval of location data
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  
    // Call getWeather function after the location is retrieved
    getWeather(latitude, longitude);
  }, function() {
    // Callback function to handle errors
    locationData.innerHTML = "Unable to retrieve location.";
  });
} else {
  locationData.innerHTML = "Geolocation is not supported by this browser.";
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
  const icon = document.getElementById(`icon`);
  let iconImage = "";
  const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  
  fetch(weatherdata)
    .then(response => response.json())
    .then(data => {
      city.innerHTML = ` City = ${data.properties.relativeLocation.properties.city}`;
      state.innerHTML = ` State = ${data.properties.relativeLocation.properties.state}`;
      
      const weatherAlerts = `https://api.weather.gov/alerts/active?area=${data.properties.relativeLocation.properties.state}`;
      
      fetch(weatherAlerts)
        .then(response => response.json())
        .then(alertData => {
          const alertTime = alertData.updated;
          console.log(alertTime);
          const correctTime = new Date(alertTime);
          const readableDateTime = correctTime.toISOString();
          console.log(readableDateTime);
          alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
          
          if(alertData.features.length > 0 && alertData.features[0].properties.headline != undefined) {
            alerts.innerHTML = alertData.features[0].properties.headline;
            alert(`${alertData.features[0].properties.headline}`);
          } else {
            alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
          }
        });
        
      fetch(data.properties.forecast)
        .then(response => response.json())
        .then(data2 => {
          switch (`${data2.properties.periods[0].probabilityOfPrecipitation.value}`) {
            case "0":
               iconImage = "clearskies.jpg";
              break;
            case (value) => value > 0:
               iconImage = "rainy.jpg";
              break;
            default:
              iconImage = "rainy.jpg";
              break;
          }
          console.log(iconImage);
          document.getElementById("icon").src=iconImage;
          winds.innerHTML = `The forecasted wind speed is ${data2.properties.periods[0].windSpeed} going in the ${data2.properties.periods[0].windDirection} direction `;
          temperature.innerHTML = `${data2.properties.periods[0].temperature} ${data2.properties.periods[0].temperatureUnit}` ;
          rainChance.innerHTML = ` There is a ${data2.properties.periods[0].probabilityOfPrecipitation.value}% chance of rain`;
        });
    })
    .catch(error => console.log(error));
}
