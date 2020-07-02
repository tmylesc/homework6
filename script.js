var city;
var cityList = [];

//loads stored cities
function loadCities() {
    var storedCities = JSON.parse(localStorage.getItem("cityList"));

    if (storedCities !== null) {
        cityList = storedCities;
    }

    $("#cityList").empty();
    $("#citySearch").val("");

    for (i = 0; i<cityList.length; i++){
        var listItem = $("<li>");
        listItem.text(cityList[i]);
        listItem.attr("data-city", cityList[i]);
        listItem.addClass("city");
        $("#cityList").prepend(listItem);

    }

}

loadCities();

//loads last weather
function loadWeather() {
    var lastWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (lastWeather !== null) {
        city = lastWeather;

        displayCurrentWeather();
        displayFutureWeather();
    }

}

loadWeather();




//On click for city search button
$("#searchBtn").on("click", function(event){ 
    event.preventDefault();

    $("#currentWeather").empty();
    $("#futureWeather").empty();


    city = $("#citySearch").val().trim();

    cityList.push(city);

    //stores current city in local storage
    localStorage.setItem("currentCity", JSON.stringify(city));
    localStorage.setItem("cityList", JSON.stringify(cityList));

    loadCities();
    displayCurrentWeather();
    displayFutureWeather();

});

//displays current weather from API info
function displayCurrentWeather () {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=6646112f1c81118a5578ef1b1b9118da"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then( async function(response) {
        console.log(response);


        var currentCity = response.name;
        var currentDate = new Date();

        var dateInfo=(currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear();

        var currentWeather = $("#currentWeather");
        var currentWeatherTitle = $("<h3>").text(currentCity + " (" + dateInfo + ")");
        currentWeatherTitle.append($("<img src = http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png />"));
        currentWeather.append(currentWeatherTitle);
        var currentTemp = response.main.temp.toFixed(1);
        currentWeather.append($("<p>").text("Temperature: " + currentTemp + "° F"));
        var currentHumidity = response.main.humidity;
        currentWeather.append($("<p>").text("Humidity: " + currentHumidity + "%"));
        var currentWind = response.wind.speed.toFixed(1);
        currentWeather.append($("<p>").text("Wind Speed: " + currentWind + " MPH"));

        var currentLong = response.coord.lon;
        var currentLat = response.coord.lat;
        
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=6646112f1c81118a5578ef1b1b9118da&lat=" + currentLat + "&lon=" + currentLong;
        var uvData = await $.ajax({
            url: uvURL,
            method: "GET"
        })
        var currentUVIndex = uvData.value;
        var uvNum = $("<span>");
        if (currentUVIndex <= 2.99) {
            uvNum.addClass("low");
        } else if (currentUVIndex <= 7.99) {
            uvNum.addClass("high");
        } else {
            uvNum.addClass("extreme");
        }
        uvNum.text(currentUVIndex);
        var currentUVDetails = $("<p>").text("UV Index: ");
        currentUVDetails.append(uvNum);
        currentWeather.append(currentUVDetails);
    })
}

//To display forecast info
function displayFutureWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=6646112f1c81118a5578ef1b1b9118da";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var forecast = $("#futureWeather");
        forecast.append($("<h4>").text("5 Day Forecast:"));
        var forecastRow = $("<div id='forecast-row' class='card-deck'>");
        forecast.append(forecastRow);

        for (i = 0; i < 5; i++) {
            var forecastDay = $("<div class='weatherCard card'>");
            var date = new Date();
            var nextDate = (date.getMonth() + 1) + "/" + (date.getDate() + i + 1) + "/" + date.getFullYear();
            var forecastDate = $("<h6>").text(nextDate);

            forecastDay.append(forecastDate);
            var weatherIcon = response.list[i].weather[0].icon;
            forecastDay.append($("<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' width='50' />"));
            var forecastTemp = response.list[i].main.temp;
            forecastDay.append($("<p>").text("Temp: " + forecastTemp + "° F"));
            var forecastHumidity = response.list[i].main.humidity;
            forecastDay.append($("<p>").text("Humidity: " + forecastHumidity + "%"));

            forecastRow.append(forecastDay);

        }
    })

}

//loads weather when a list from the city is clicked
function clickedCity() {
    city = $(this).attr("data-city");

    $("#currentWeather").empty();
    $("#futureWeather").empty();
    
    displayCurrentWeather();
    displayFutureWeather();
}
$(document).on("click", ".city", clickedCity);