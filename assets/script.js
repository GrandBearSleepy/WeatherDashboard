// api.openweathermap.org / data / 2.5 / weather ? q = { city name } & appid={ API key }
//api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// var userInput = "perth";


var APIKey = "738fd9d3767b833f423425850f9dfed7";

var displayCard = $("#tem-display");

var searchList = JSON.parse(localStorage.getItem("search")) || []


function renderCurrent() {

    displayCard.empty()

    var userInput = $("#city-name").val().trim();

    if (userInput !== "") {
        var queryCurrentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=" + APIKey;
        $.ajax({
            url: queryCurrentURL,
            method: "GET"
        }).then(function (responseCu) {
            console.log(responseCu);

            // cityName = $("#city-name").val();
            var dateStamp = responseCu.dt;
            //this retrieves the unix timestamp
            var dateString = moment.unix(dateStamp).format("MM/DD/YYYY");

            // var date = new Date(unix_timestamp * 1000);
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

            // console.log(queryUvURL);

            $.ajax({
                url: queryUvURL,
                method: "GET"
            }).then(function (responseUv) {
                var UVDiv = $("<div>");
                UVDiv.text("UV Index: " + responseUv.value);
                UVDiv.attr("id", "UV-index");
                displayCard.append(UVDiv);
                // console.log(response);

            })
            // console.log(response);
            var queryForecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
            console.log(queryForecastURL);
            $.ajax({
                url: queryForecastURL,
                method: "GET"
            }).then(function (responesFc) {
                var fiveDayForecast = responesFc.daily.slice(0, 5);

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

                    console.log(iconFcCode);
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

                typeof fiveDayForecast;

                console.log(fiveDayForecast);
                console.log(responesFc);
            })
        })


        // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}

        // var queryForecastURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + userInput + "&exclude=hourly&units=imperial&appid=" + APIKey;
        // console.log(queryForecastURL);
        // $.ajax({
        //     url: queryForecastURL,
        //     method: "GET"
        // }).then(function (respones) {
        //     console.log(respones);


        // })
    }


}

// renderCurrent();

function displayForecast() {


}

$("#btn-search").on("click", function (event) {
    renderCurrent();

});
// displayCurrent();
// displayForecast();








// $.ajax({
//     url: queryForecastURL,
//     method: "GET"
// }).then(function (response) {
//     console.log(response);
// })

