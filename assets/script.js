// api.openweathermap.org / data / 2.5 / weather ? q = { city name } & appid={ API key }
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// var userInput = "perth";


var APIKey = "738fd9d3767b833f423425850f9dfed7";

var displayCard = $("#tem-display");

var searchList = JSON.parse(localStorage.getItem("search")) || [];

renderSearchList();

function getUserInput() {
    var userInput = $("#city-name").val().trim();
    if (userInput !== "") {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET",
            success: function () {
                searchList.unshift(userInput);
                searchList = searchList.slice(0, 5);
                searchList = Array.from(new Set(searchList));
                localStorage.setItem("search", JSON.stringify(searchList));
                renderSearchList();
            }
        })
    }
    else return;
    return userInput;
}

function renderWeather(city) {

    displayCard.empty()
    // var city = getUserInput();

    if (city !== "") {
        var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryCurrentURL,
            method: "GET"
        }).then(function (responseCu) {
            console.log(responseCu);

            var dateStamp = responseCu.dt;
            //this retrieves the unix timestamp
            var dateString = moment.unix(dateStamp).format("MM/DD/YYYY");

            console.log(dateString);
            $("#city").text(responseCu.name + " (" + dateString + ") ");
            var iconImg = $("<img>");
            var iconCode = responseCu.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            iconImg.attr('src', iconUrl);
            $("#city").append(iconImg);

            var tempF = responseCu.main.temp + " \xB0F";

            var temP = $("<p>").text("Temperature: " + tempF);
            displayCard.append(temP);

            var humP = $("<p>").text("Humidity: " + responseCu.main.humidity + "%");
            displayCard.append(humP);

            var winP = $("<p>").text("Wind Speed: " + responseCu.wind.speed + " PMH");
            displayCard.append(winP);

            var lat = responseCu.coord.lat;
            var lon = responseCu.coord.lon;
            var queryUvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

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



                // Set the class dependent on the UV index
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

            var queryForecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
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
                    var iconFcUrl = "http://openweathermap.org/img/w/" + iconFcCode + ".png";
                    iconFcImg.attr("src", iconFcUrl);

                    $("#" + i).append(iconFcImg);
                    $("#" + i).append(br);

                    var tempP = $("<p>");
                    var tempFc = "Temp: " + fiveDayForecast[i].temp.day + " \xB0F";
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

$("#btn-search").on("click", function (event) {
    event.preventDefault();
    renderWeather(getUserInput());
    renderSearchList();
});

$(document).on("click", ".serch-list", function () {
    event.preventDefault();
    var listName = $(this).text();
    renderWeather(listName);
});




