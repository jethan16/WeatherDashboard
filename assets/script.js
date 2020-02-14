var citySearch = $("#searchBar")


init()


// Search Bar Mechanics

function init() {

    renderList()
    stored()
    localStorage.getItem("weather")

    $("#button").on("click", function () {
        var value = $(this).val();
        console.log(value);
        console.log(citySearch.val());

        if (citySearch.val() === "") {
            return
        }
        //
        var storedCities = JSON.parse(localStorage.getItem("cities") || "[]")

        if (storedCities.length > 6) {
            storedCities.splice([7])
            // localStorage.removeItem("city" + [0])
            // return
        }

        storedCities.unshift(citySearch.val())
        localStorage.setItem("cities", JSON.stringify(storedCities))
        //
        renderList()
        getWeather(citySearch.val())
        getForecast(citySearch.val())
    })
}

function stored() {
    if (storedCities.length === 0) return
    getWeather(storedCities[0])
    getForecast(storedCities[0])
}
// API for weather
function renderList() {
    $("#historyList").empty()
    storedCities = JSON.parse(localStorage.getItem("cities") || "[]")
    for (var i = 0; i < storedCities.length; i++) {
        var liEl = $("<li>")
        liEl.text(storedCities[i])
        liEl.addClass("listItem")
        $("ul").append(liEl)

    }
}
$("ul").on("click", ".listItem", function (event) {
    event.preventDefault()
    var city = $(this).text()
    console.log(city)


    getWeather(city)
    getForecast(city)
})

function getWeather(city) {
    var projection = $(".projection")
    var title = $(".title")
    var icon = $("<img>")
    var forecast = $(".forecastRow")

    projection.empty()
    title.empty()
    icon.empty()
    forecast.empty()



    var currentDateAndTime = new Date();
    // var city = citySearch.val()
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=39bfeb813c7baec43daa56063ee60904";
    // console.log("city: " + city)

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        // var currentCity = citySearch.val()
        icon.attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")
        // console.log(icon)

        title.append(response.name + " " + currentDateAndTime.toDateString(), icon)


        var storedTemp = "Temperature: " + response.main.temp + " °F"
        var storedHumidity = "Humidity: " + response.main.humidity + "%"
        var storedSpeed = "Wind Speed: " + response.wind.speed + "MPH"
        var storedLon = response.coord.lon;
        console.log(storedLon)
        var storedLat = response.coord.lat;
        console.log(storedLat)

        // coords.push(storedLat, storedLon)

        var storedWeather = []


        storedWeather.push(storedTemp, storedHumidity, storedSpeed)

        localStorage.setItem("weather", JSON.stringify(storedWeather))
        // console.log(storedWeather);

        for (var i = 0; i < storedWeather.length; i++) {
            var temp = $("<h3>").text(storedWeather[i])
            projection.append(temp)
        }

        uv()

        function uv() {
            var indexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=166a433c57516f51dfab1f7edaed8413&lat=" + storedLat + "&lon=" + storedLon
            console.log(indexUrl)

            $.ajax({
                url: indexUrl,
                method: "GET"
            }).then(function (uvIndex) {
                console.log(uvIndex.value);
                var index = uvIndex.value;
                var uv = $("<h3>").text("UV Index: " + index)
                projection.append(uv)

                storedWeather.push(index)



            })
        }
    })
}

function getForecast(city) {

    // var city = citySearch.val()
    var queryUrl5day = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    // console.log("url: " + queryUrl5day)
    // console.log("city: " + city)

    $(".forecastTitle").empty()
    var forecastHeader = $("<h1>")
    forecastHeader.addClass("forecastTitle")
    forecastHeader.text("5 day forecast:")
    $(".forecastTitle").prepend(forecastHeader)

    $.ajax({
        url: queryUrl5day,
        method: "GET"
    }).then(function (forecast) {

        // console.log(forecast)

        forecast.list.forEach(function (day) {

            // $(".forecastRow").empty()

            if (day.dt_txt.indexOf("12:00:00") !== -1) {
                //date
                var date = day.dt_txt.split(" ")[0]
                // console.log(day)
                var card = $("<div>")
                $(".forecastRow").append(card)
                var dateEl = $("<h3>");
                card.append(dateEl.text(date))
                card.addClass("card")
                //icon
                var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png")
                card.append(img)
                //temp
                var temp = $("<h3>");
                temp.text("Temp: " + day.main.temp + " °F")
                card.append(temp)
                //humidity
                var humid = $("<h3>");
                humid.text("Humidity: " + day.main.humidity + "%")
                card.append(humid)

            }
        })





        // for (var i = 0; i < 5; i++) {
        //     var icon = $("<img>");
        //     var card = $("<div>")
        //     card.addClass("card")
        //     card.attr("id", i)
        //     $(".forecastRow").append(card)
        //     card.append($("<h3>").text(response.list[i].dt_txt))
        // }
        // icon.attr("src", "http://openweathermap.org/img/wn/" + response.list[0].weather.icon + "@2x.png")
        // console.log(response.list[0].dt)
        // $(".card").append($("<h3>").text(icon))
        // $(".card").append($("<h3>").text("Temp: " + response.list[i].main.temp + " °F"))
        // $(".card").append($("<h3>").text("Humidity: " + response.list[i].main.humidity + " %"))
    })
}
















