let weatherSearch = document.getElementById("weather-search");
let city = document.getElementById("city");
let srchHistory = document.querySelector(".history");
let currentWeather = document.querySelector(".crtWeather");
let mainContainer = document.querySelector(".maincont");
let searchContainer = document.querySelector(".sidebar");

// This will get the search history from the local storage and parse it into JSON, if there is nothing to get it will give an empty array
let historyStorage = JSON.parse(localStorage.getItem("srchHistory")) || [];

// Function to update the search history and local storage
// Function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Function to update the search history and local storage
function getSrchHistory(cityName) {
  // Capitalize the first letter of each word in cityName
  cityName = capitalizeFirstLetter(cityName);

  // Check if the city already exists in the history
  if (!historyStorage.includes(cityName)) {
    historyStorage.push(cityName);
    localStorage.setItem("srchHistory", JSON.stringify(historyStorage));
  }
}

// function to show search history
function showSrchHistory() {
  srchHistory.innerHTML = "";
  // Reverse the order of historyStorage to display the most recent history at the top
  const reversedHistory = historyStorage.slice().reverse();
  // cycle through each item in the reversed history storage
  for (const item of reversedHistory) {
    // creates a list elements for each search history item and adds an even listener to it, once clicked it will run the same function as the search button
    let listItem = document.createElement("li");
    listItem.textContent = item;
    srchHistory.appendChild(listItem);
    listItem.addEventListener("click", function () {
      searchContainer.classList.add("slideLeft");
      mainContainer.classList.add("end");
      let cityName = listItem.textContent;
      let apiKey = "8dce731c7a5d6e0efd897c9690f0d4b8";
      let apiUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&APPID=" +
        apiKey +
        "&units=imperial";

      fetch(apiUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(function (data) {
          displayCurrentWeather(data);
          fetchForecastData(data.coord.lat, data.coord.lon);
          console.log(data, "bye");
        })
        .catch(function (error) {
          console.error("Fetch error:", error);
        });
    });
  }
}


// adding an event listener to the weather search element that will trigger once submitted
weatherSearch.addEventListener("submit", function (event) {
  event.preventDefault();
  searchContainer.classList.add("slideLeft");
  mainContainer.classList.add("end");
  let cityName = city.value;
  getSrchHistory(cityName);
  showSrchHistory();
  city.value = "";

  // defining the api key and the api url, grabbing the city name input that is given by the user
  let apiKey = "8dce731c7a5d6e0efd897c9690f0d4b8";
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&APPID=" +
    apiKey +
    "&units=imperial";
  // fetching the data from the api, if the response is good it will run the displaycurrentweather and fetchforecastdata functions
  fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(data);
      fetchForecastData(data.coord.lat, data.coord.lon);
      console.log(data, "hello");
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
});

// function for displaying the current weather by adding the various data to elements in the html
function displayCurrentWeather(data) {
  document.getElementById(
    "cityName"
  ).textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("date").textContent = `${dayjs
    .unix(data.dt)
    .format("ddd MM/DD/YYYY")}`;
  document.getElementById("temp").textContent = `${Math.round(
    data.main.temp
  )} °F`;
  document.getElementById("humidity").textContent = `${data.main.humidity} %`;
  document.getElementById("windspeed").textContent = `${data.wind.speed} MPH`;
  document.getElementById("weather-type").textContent = `${data.weather[0].description}`;
  document.getElementById(
    "icon"
  ).src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
}

// function that will fetch the forecast data using the latitude and longitude
function fetchForecastData(lat, lon) {
  let apiKey = "8dce731c7a5d6e0efd897c9690f0d4b8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      displayForecastData(data);
    });
}

// function that will display the forecast data
function displayForecastData(data) {
  let fiveday = document.querySelector(".fiveday");
  fiveday.innerHTML = "";

  // for loop that will get the weather information for the forecast at the sime time of each of the five days
  for (let i = 3; i < data.list.length; i += 8) {
    // creating elements that will hold the various data that will populate within each days forecast
    let day = document.createElement("div");
    let date = document.createElement("h4");
    date.textContent = dayjs.unix(data.list[i].dt).format("ddd MM/DD/YYYY");
    let temp = document.createElement("p");
    let humidity = document.createElement("p");
    let windspeed = document.createElement("p");
    let icon = document.createElement("img");
    day.append(icon, date, temp, humidity, windspeed);
    fiveday.append(day);
    temp.textContent = `Temp: ${Math.round(data.list[i].main.temp)} °F`;
    humidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
    windspeed.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
    icon.src = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
  }
}

showSrchHistory();
