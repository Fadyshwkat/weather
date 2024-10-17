let forecastTable = document.querySelector(".forecast-table");
let searchInput = document.querySelector(".search-input");
let menuToggle = document.querySelector(".menu-toggle")

menuToggle.addEventListener("click", function() {
    const menu = menuToggle.nextElementSibling;
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
});


cast = {};

searchInput.addEventListener("input", function() {
    const searchTerm = this.value.trim();
    if (searchTerm) {
        getCity(searchTerm);
    }
});

async function getCity(term) {
    try {
        var request = await fetch(`https://api.weatherapi.com/v1/search.json?key=a8460798e6fc4a98b6f121722240810&q=${term}`);
        var data = await request.json();
        if (Array.isArray(data) && data.length > 0 && data[0].name) {
            getThreeDaysForecast(data[0].name);
        }
    } catch (error) {
        console.error("Error fetching city data:", error);
    }
}

async function getThreeDaysForecast(city) {
    try {
        var request = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a8460798e6fc4a98b6f121722240810&q=${city}&days=3`);
        var data = await request.json();
        cast = data;
        getDayAndMonth();
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

getThreeDaysForecast("cairo");

function getDayAndMonth() {
    let dateString = cast.forecast.forecastday[0].date;
    let dateObj = new Date(dateString);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let todayDayName = dayNames[dateObj.getDay()];

    let tomorrowDate = new Date(dateObj);
    tomorrowDate.setDate(dateObj.getDate() + 1);
    let tomorrowDayName = dayNames[tomorrowDate.getDay()];

    let dayAfterTomorrowDate = new Date(dateObj);
    dayAfterTomorrowDate.setDate(dateObj.getDate() + 2);
    let dayAfterTomorrowDayName = dayNames[dayAfterTomorrowDate.getDay()];
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = dateObj.getDate();
    let month = monthNames[dateObj.getMonth()];
    let year = dateObj.getFullYear();
    let formattedDate = `${month} ${day}, ${year}`;
    displayForecast(formattedDate, todayDayName, tomorrowDayName, dayAfterTomorrowDayName);
}

function displayForecast(formattedDate, todayDayName, tomorrowDayName, dayAfterTomorrowDayName) {
    const currentTemp = cast.current.temp_c || "N/A";
    const currentConditionText = cast.current.condition.text || "N/A";
    forecastTable.innerHTML = `<div class="today-card col-lg-4 ">
                        <header class="pb-0">
                            <p>${todayDayName}</p>
                            <p>${formattedDate}</p>
                        </header>
                        <div class="today-body">
                            <p class="fs-5 fw-semibold">${cast.location.name}</p>
                            <div class="degree d-flex justify-content-around align-items-center">
                                <p>${currentTemp}°C</p>
                                <div>
                                     <img class="w-100" src="${cast.current.condition.icon}" alt="forecast">
                                 </div>
                            </div>
                        </div>
                        <div class="today-foot">
                            <p class="text-info">${currentConditionText}</p>
                            <div class="today-icons">
                                <span><i class="fa-solid fa-umbrella"></i>20%</span>
                                <span><i class="fa-solid fa-wind ms-3"></i>18km/h</span>
                                <span><i class="fa-solid fa-compass ms-3"></i>East</span>
                            </div>
                        </div>
                    </div>
                    <div class="tomorrow-card text-center col-lg-4 ">
                        <header>
                            <p>${tomorrowDayName}</p>
                        </header>
                        <div class="tomorrow-body">
                                <div class="w-25 mx-auto">
                                     <img class="w-100" src="${cast.forecast.forecastday[1].day.condition.icon}" alt="forecast">
                                 </div>
                                <p class="text-white fs-4 fw-semibold mb-2">${cast.forecast.forecastday[1].day.maxtemp_c}°C</p>
                                <p>${cast.forecast.forecastday[1].day.mintemp_c}°C</p>
                                <p class="text-info">${cast.forecast.forecastday[1].day.condition.text}</p>
                        </div>
                    </div>
                    <div class="tomorrow-card text-center col-lg-4 card-right">
                        <header class="today-col-head">
                            <p>${dayAfterTomorrowDayName}</p>
                        </header>
                        <div class="tomorrow-body today-col-body">
                                 <div class="w-25 mx-auto">
                                     <img class="w-100" src="${cast.forecast.forecastday[2].day.condition.icon}" alt="forecast">
                                 </div>
                                <p class="text-white fs-4 fw-semibold mb-2">${cast.forecast.forecastday[2].day.maxtemp_c}°C</p>
                                <p>${cast.forecast.forecastday[2].day.mintemp_c}°C</p>
                                <p class="text-info">${cast.forecast.forecastday[2].day.condition.text}</p>
                        </div>
                    </div>`;
}
