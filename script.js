let locationDisplay;
let tempDisplay;
let degreesDisplay;
let conditionDisplay;
let icon;

let tempAndUnits;

let permissionDenied;
let permissionGranted;

let degreesC;
let degreeUnit = 'C';

window.onload = function() {
  init();
  main();
};

function init() {
  locationDisplay = document.getElementById('location');
  tempDisplay = document.getElementById('temperature');
  degreesDisplay = document.getElementById('degrees');
  conditionDisplay = document.getElementById('condition');
  icon = document.getElementById('icon');

  tempAndUnits = document.getElementById('temp-and-units');

  permissionDenied = document.getElementById('permission-denied');
  permissionGranted = document.getElementById('permission-granted');
}

function main() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition( (position) => {
      let coords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      getWeather(coords);
    });
  } else {
    console.log('Could not get location');
  }

  tempAndUnits.addEventListener('click', changeDegreeUnit);
}

function getWeather (coords) {
  let request = new XMLHttpRequest();
  let weather;

  request.addEventListener('load', function() {
    weather = JSON.parse(this.responseText);
    displayWeather(weather);
  });

  request.open('GET', `https://fcc-weather-api.glitch.me/api/current?lat=${ coords.lat }&lon=${ coords.lon }`);
  request.send();
}

function displayWeather(weather) {
  degreesC = weather.main.temp;

  permissionDenied.style.display = 'none';
  permissionGranted.style.display = 'flex';

  locationDisplay.textContent = `${ weather.name }, ${ weather.sys.country }`;
  tempDisplay.textContent = degreesC;
  degreesDisplay.textContent = degreeUnit;
  conditionDisplay.textContent = weather.weather[0].main;
  displayIcon(weather);
}

function changeDegreeUnit() {
  if ( degreeUnit === 'C' ) {
    degreeUnit = 'F';
    let degreesF = (degreesC * (9 / 5) + 32).toFixed(2);

    tempDisplay.textContent = degreesF;
  } else {
      degreeUnit = 'C';

      tempDisplay.textContent = degreesC;
  }

  degreesDisplay.textContent = degreeUnit;
}

function displayIcon(weather) {
  switch (weather.weather[0].main.toLowerCase()) {
    case 'rain':
      icon.innerHTML = '<i class="wi wi-rain"></i>';
      break;
    case 'clouds':
      icon.innerHTML = '<i class="wi wi-cloudy"></i>';
      break;
    case 'drizzle':
      icon.innerHTML = '<i class="wi wi-sprinkle"></i>';
      break;
    case 'thunderstorm':
      icon.innerHTML = '<i class="wi wi-thunderstorm"></i>';
      break;
    case 'snow':
      icon.innerHTML = '<i class="wi wi-snow"></i>';
      break;
    case 'clear':
      icon.innerHTML = '<i class="wi wi-day-sunny"></i>';
      break;
    default:
      icon.innerHTML = `<img src="${ weather.weather[1].icon}"/>`;
  }
}
