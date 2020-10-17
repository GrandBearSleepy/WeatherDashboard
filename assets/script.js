//api key
var APIKey = "738fd9d3767b833f423425850f9dfed7";

//current weather display div
var displayCard = $("#tem-display");

//local storage
var searchList = JSON.parse(localStorage.getItem("search")) || [];

//show search history
renderSearchList();

//function to get adn validate user's input, store in local storage if user's input valid 
function getUserInput() {
    var userInput = $("#city-name").val().trim();
    if (userInput !== "") {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=metric&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET",
            success: function () {
                //insert the input in the first position of array
                searchList.unshift(userInput);
                //only store the first five members in array
                searchList = searchList.slice(0, 5);
                //remove duplicates
                searchList = Array.from(new Set(searchList));
                //store array on local storage
                localStorage.setItem("search", JSON.stringify(searchList));
                renderSearchList();
            }
        })
    }
    else return;
    return userInput;
}
//display search result fuction. Parameter: city
function renderWeather(city) {
    //empty display area
    displayCard.empty()
    if (city !== "") {
        //use ajax request to get current weather
        var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIKey;
        $.ajax({
            url: queryCurrentURL,
            method: "GET"
        }).then(function (responseCu) {
            var dateStamp = responseCu.dt;
            //this retrieves the unix timestamp
            var dateString = moment.unix(dateStamp).format("MM/DD/YYYY");
            //render current date
            $("#city").text(responseCu.name + " (" + dateString + ") ");
            //render weather icon
            var iconImg = $("<img>");
            var iconCode = responseCu.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
            iconImg.attr('src', iconUrl);
            $("#city").append(iconImg);
            //render temp
            var tempF = responseCu.main.temp + " \xB0C";
            var temP = $("<p>").text("Temperature: " + tempF);
            displayCard.append(temP);
            //render humidity
            var humP = $("<p>").text("Humidity: " + responseCu.main.humidity + "%");
            displayCard.append(humP);
            //render wind speed
            var winP = $("<p>").text("Wind Speed: " + responseCu.wind.speed + " PMH");
            displayCard.append(winP);
            //get city geographical coordinates
            var lat = responseCu.coord.lat;
            var lon = responseCu.coord.lon;
            //ajax request to get UV index by geographical coordinates
            var queryUvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;
            $.ajax({
                url: queryUvURL,
                method: "GET"
            }).then(function (responseUv) {
                var UVSpan = $("<span>");
                var UVDiv = $("<div>");
                var UV = responseUv.value;
                UVDiv.text("UV Index: ");
                UVSpan.text(UV);
                UVDiv.attr("id", "UV-index");
                UVDiv.append(UVSpan);
                displayCard.append(UVDiv);
                // set color class dependent on the UV index
                if (UV <= 2) {
                    rating = "low";
                }
                else if (UV <= 5) {
                    rating = "moderate";
                }
                else if (UV <= 7) {
                    rating = "high";
                }
                else if (UV <= 10) {
                    rating = "veryhigh";
                }
                else {
                    rating = "extreme";
                }
                UVSpan.addClass(rating);
            })
            //ajax to get five day forecast
            var queryForecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;
            $.ajax({
                url: queryForecastURL,
                method: "GET"
            }).then(function (responesFc) {
                var fiveDayForecast = responesFc.daily.slice(1, 6);
                $(".forecast").empty();
                for (var i = 0; i < fiveDayForecast.length; i++) {
                    var dateFc = $("<h6>");
                    dateFc.text(moment.unix(fiveDayForecast[i].dt).format("MM/DD/YYYY"))
                    $("#" + i).append(dateFc);

                    var iconFcImg = $("<img>");
                    var br = $("<br>");
                    var iconFcCode = fiveDayForecast[i].weather[0].icon;
                    var iconFcUrl = "https://openweathermap.org/img/w/" + iconFcCode + ".png";
                    iconFcImg.attr("src", iconFcUrl);

                    $("#" + i).append(iconFcImg);
                    $("#" + i).append(br);

                    var tempP = $("<p>");
                    var tempFc = "Temp: " + fiveDayForecast[i].temp.day + " \xB0C";
                    tempP.text(tempFc);
                    $("#" + i).append(tempFc);
                    console.log(tempP);

                    var humP = $("<p>");
                    var humFc = fiveDayForecast[i].humidity;
                    humP.text("Humidity: " + humFc + " %");
                    $("#" + i).append(humP);
                }
            })
        }).fail(function () {
            alert("Couldn't find the city, please try again");
        })
    }
}
//function to render search history
function renderSearchList() {
    $("#search-list").empty();

    for (var i = 0; i < searchList.length; i++) {
        var searchLi = $("<li>");
        searchLi.addClass("capitalize");
        searchLi.addClass("list-group-item");
        searchLi.addClass("serch-list")
        searchLi.text(searchList[i]);
        $("#search-list").append(searchLi);

    }

}

$(document).ready(function () {
    //search button listener
    if (searchList.length !== 0) {
        renderWeather(searchList[0]);
        $("#fiveday-forecast").removeClass("hide");
    }
    $("#btn-search").on("click", function (event) {
        event.preventDefault();
        renderWeather(getUserInput());
        renderSearchList();
        $("#fiveday-forecast").removeClass("hide");
    });
    //search history list listener
    $(document).on("click", ".serch-list", function (event) {
        event.preventDefault();
        var listName = $(this).text();
        renderWeather(listName);
        $("#fiveday-forecast").removeClass("hide");
    });


})





