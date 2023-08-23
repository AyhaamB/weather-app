let weatherSearch = document.getElementById('weather-search');
let city = document.getElementById('city');
let srchHistory = document.querySelector('.history');
let currentWeather = document.querySelector('.crtWeather')

// This will get the search history from the local storage and parse it into JSON, if there is nothing to get it will give an empty array
let historyStorage = JSON.parse(localStorage.getItem('srchHistory')) || [];

// Function to update the search history and local storage
function getSrchHistory(cityName) {
    historyStorage.push(cityName);
    localStorage.setItem('srchHistory', JSON.stringify(historyStorage));
}

// function to show search history 
function showSrchHistory() {
    srchHistory.innerHTML = '';
    // cycle through each item in the history storage
    for (const item of historyStorage) {
        // creates a list elements for each search history item and adds an even listener to it, once clicked it will run the same function as the search button
        let listItem = document.createElement('li');
        listItem.textContent = item;
        srchHistory.appendChild(listItem);
        listItem.addEventListener("click", function () {
            let cityName = listItem.textContent
            let apiKey = '8dce731c7a5d6e0efd897c9690f0d4b8';
            let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&APPID=' + apiKey;

            fetch(apiUrl)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(function (data) {
                    displayCurrentWeather(data);
                    fetchForecastData(data.coord.lat, data.coord.lon);
                })
                .catch(function (error) {
                    console.error('Fetch error:', error);
                });
        })
    }
}

// adding an event listener to the weather search element that will trigger once submitted
weatherSearch.addEventListener('submit', function (event) {
    event.preventDefault();
    let cityName = city.value;
    getSrchHistory(cityName);
    showSrchHistory();
    city.value = '';

    // defining the api key and the api url, grabbing the city name input that is given by the user
    let apiKey = '8dce731c7a5d6e0efd897c9690f0d4b8';
    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&APPID=' + apiKey + "&units=imperial";
    // fetching the data from the api, if the response is good it will run the displaycurrentweather and fetchforecastdata functions
    fetch(apiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
            fetchForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(function (error) {
            console.error('Fetch error:', error);
        });
});

// function for displaying the current weather by adding the various data to elements in the html
function displayCurrentWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("date").textContent = `Date: ${dayjs.unix(data.dt).format("ddd MM/DD/YYYY")}`;
    document.getElementById("temp").textContent = `Temperature: ${data.main.temp} F`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity} %`;
    document.getElementById("windspeed").textContent = `Wind Speed: ${data.wind.speed} MPH`;
    document.getElementById("icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
}

// function that will fetch the forecast data using the latitude and longitude
function fetchForecastData(lat, lon) {
    let apiKey = '8dce731c7a5d6e0efd897c9690f0d4b8';
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    fetch(apiUrl)
        .then(function (res) {
            return res.json();

        }).then(function (data) {
            displayForecastData(data);
        })
}

// function that will display the forecast data 
function displayForecastData(data) {
    let fiveday = document.querySelector(".fiveday");
    fiveday.innerHTML = ''; 

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
        temp.textContent = `Temp: ${data.list[i].main.temp} F`;
        humidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
        windspeed.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
        icon.src = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
    }
}

showSrchHistory();
