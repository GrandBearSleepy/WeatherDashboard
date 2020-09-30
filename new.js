var APIKey = "738fd9d3767b833f423425850f9dfed7";
var displayCard = $("#tem-display");
var searchList = JSON.parse(localStorage.getItem("search")) || [];

function getUserInput() {
    var userInput = $("#city-name").val().trim();
    if (userInput !== "") {
        searchList.unshift(userInput);
        searchList = searchList.slice(0, 6);
        searchList = Array.from(new Set(searchList));
        localStorage.setItem("search", JSON.stringify(searchList));
    }
    else return;
    return userInput;
}

function getCurrent(city) {
    var city = getUserInput();
}