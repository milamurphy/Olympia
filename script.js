window.onscroll = function () {
    var navbar = document.querySelector('.ac_navbar');
    var logo = document.querySelector('.ac_logo');
    var paristext = document.querySelector('.ac_parisText');
    var scrollPosition = window.scrollY;

    if (scrollPosition > 350) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        navbar.style.fontSize = '22px';
        logo.style.height = '4vh'
        navbar.classList.add('ac_blurFilter');
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.fontSize = '25px';
        logo.style.height = '5vh';
        navbar.classList.remove('ac_blurFilter');
    }
    /*
        if (scrollPosition > 100) {
            paristext.style.opacity = '0';
            paristext.style.transform = 'translate(-50%, -200%)';
        } else {
            paristext.style.opacity = '1';
            paristext.style.transform = 'translate(-50%, -50%)';
        }
        */

    // Reference: https://www.youtube.com/watch?v=by-3r2eqMXA
    const bg = document.getElementById('ac_parallax');
    window.addEventListener('scroll', function () {
        let newSize = 105 - window.pageYOffset / 12;
        newSize = Math.max(newSize, 100);
        bg.style.backgroundSize = newSize + '%';

        if (window.innerWidth < 1000) {
            bg.style.backgroundSize = 'cover';
        }
    })
}

const slideshow = document.getElementById('ac_parallax');
const images = ['parisbg.jpg', 'parisbg2.jpg', 'parisbg3.jpg'];
let currentIndex = 0;

function changeBackground() {
    slideshow.style.backgroundImage = `url("../images/${images[currentIndex]}")`;
    currentIndex = (currentIndex + 1) % images.length; // cycle through the images
}

setInterval(changeBackground, 5000); // 5 seconds

document.querySelector('.ac_hamburger').addEventListener('click', function () {
    document.querySelector('.ac_navbarLinks').classList.toggle('active');
});

// countdown to olympics
// Reference: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
var countDownDate = new Date("July 26, 2024 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("ac_countdown").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("ac_countdown").innerHTML = "Olympics has started!";
    }
}, 1000);

// google maps
let map
let service
let directionsRenderer

function loadMap() {
    let services_centre_location = { lat: 48.856614, lng: 2.3522219 }; // Paris

    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "MY_MAP_ID",
        zoom: 17,
        center: new google.maps.LatLng(services_centre_location),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "hide_poi"]
        }
    })

    hidePointsOfInterest(map)

    let startInput = document.getElementById("start");
    let endInput = document.getElementById("end");
    new google.maps.places.Autocomplete(startInput);
    new google.maps.places.Autocomplete(endInput);

    service = new google.maps.places.PlacesService(map)

    service.nearbySearch({
        location: services_centre_location, // centre of the search
        radius: 500, // radius (in metres) of the search
        type: "cafe"
    }, getNearbyServicesMarkers)

    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions"));
}

function calculateRoute(travelMode) {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let waypointsInput = document.getElementById("waypoints").value;

    if (start === "" || end === "") {
        return;
    }

    let waypoints = [];
    if (waypointsInput !== "") {
        waypoints = waypointsInput.split(",").map(waypoint => {
            return { location: waypoint.trim(), stopover: true };
        });
    }

    let request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: travelMode
    };

    let directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (route, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(route);
            document.getElementById("directionsDetails").open = true;
            let directionsPanel = document.getElementById("directionsPanel");
            directionsPanel.innerHTML = "";
            let summaryPanel = document.createElement("div");
            directionsRenderer.setPanel(summaryPanel);
            directionsPanel.appendChild(summaryPanel);
        }
    });
}

function getNearbyServicesMarkers(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        let table = document.createElement('table');

        let headerRow = table.insertRow();
        let imageHeader = headerRow.insertCell(0);
        let nameHeader = headerRow.insertCell(1);
        let addressHeader = headerRow.insertCell(2);
        let ratingHeader = headerRow.insertCell(3);

        imageHeader.innerHTML = '<b>Image</b>';
        nameHeader.innerHTML = '<b>Name</b>';
        addressHeader.innerHTML = '<b>Address</b>';
        ratingHeader.innerHTML = '<b>Rating</b>';

        results.forEach(result => {
            let row = table.insertRow();
            let imageCell = row.insertCell(0);

            if (result.photos && result.photos.length > 0) {
                imageCell.innerHTML = '<img src="' + result.photos[0].getUrl({ maxWidth: 100 }) + '">';
            } else {
                imageCell.innerHTML = 'No Image Available';
            }

            row.insertCell(1).innerHTML = result.name;
            row.insertCell(2).innerHTML = result.vicinity || "Address not available";
            row.insertCell(3).innerHTML = result.rating || "Rating not available";
        });

        document.getElementById("placesTable").appendChild(table);

        results.forEach(result => {
            createMarker(result);
        });
    }
}

let infoWindow = null
function createMarker(place) {
    let icon = document.createElement("img")
    icon.src = place.icon
    icon.style.width = "20px"
    icon.style.height = "20px"

    let marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        content: icon,
        position: place.geometry.location,
    });

    if (infoWindow === null) {
        infoWindow = new google.maps.InfoWindow()
    }

    google.maps.event.addListener(marker, "click", () => {
        request = {
            placeId: place.place_id,
            fields: [
                "name",
                "formatted_address",
                "international_phone_number",
                "icon",
                "geometry",
                "photos",
                "rating",
                "opening_hours",
            ],
        };

        let address = place.vicinity || "Address not available";
        let content = '<div id=ac_container><div class=ac_text><strong>' + place.name + '</strong><br>'

        if (place.photos && place.photos.length > 0) {
            content += '<img class=ac_backgroundImage src="' + place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + '"><img class=ac_backgroundImage src=images/flagoutline.png><br>';
        }

        content += address + '</div></div>';

        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    })
}

function hidePointsOfInterest(map) {
    let styles = [
        {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }]
        }
    ]

    let styledMapType = new google.maps.StyledMapType(styles, { name: "POI Hidden", alt: "Hide Points of Interest" })
    map.mapTypes.set("hide_poi", styledMapType)

    map.setMapTypeId("hide_poi")
} // end of google maps


async function displayWeather() {
    const cityName = document.getElementById('ac_cityInput').value;
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3df6feeb79mshd8b36d9595f9396p10f4f4jsnc42486578bab',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const location = result.location;
        const currentWeather = result.current;
        const forecast = result.forecast.forecastday;

        const currentWeatherDiv = document.getElementById('ac_currentWeather');
        currentWeatherDiv.innerHTML = '';
        currentWeatherDiv.innerHTML = `<div>
                <h3>Current</h3>
                    <p>Place Name: ${location.name}</p>
                    <p>Country: ${location.country}</p>
                    <p>Temperature: ${currentWeather.temp_c}&deg;C</p>
                    <p>Wind Speed: ${currentWeather.wind_kph} km/h</p>
                    <p>Humidity: ${currentWeather.humidity}</p>
                    </div>
                `;


        const tomorrowDiv = document.getElementById('ac_tomorrow');
        const theDayAfterDiv = document.getElementById('ac_theDayAfter');

        /* Reference: https://cssgradient.io/ */
        function setCardBackgroundColor(temperature, card) {
            if (temperature < 10) {
                card.style.background = 'rgb(0,47,99)';
                card.style.background = 'linear-gradient(180deg, rgba(0,47,99,1) 30%, rgba(133,114,255,1) 100%)';
            } else if (temperature >= 10 && temperature <= 15) {
                card.style.background = 'rgb(47,147,179)';
                card.style.background = 'linear-gradient(180deg, rgba(47,147,179,1) 56%, rgba(165,207,202,1) 80%, rgba(255,252,213,1) 100%)';
            } else {
                card.style.background = 'rgb(255,133,72)';
                card.style.background = 'linear-gradient(180deg, rgba(255,133,72,1) 41%, rgba(255,240,114,1) 100%)';
            }
        }

        setCardBackgroundColor(parseFloat(currentWeather.temp_c), currentWeatherDiv);
        setCardBackgroundColor(parseFloat(forecast[1].day.avgtemp_c), tomorrowDiv);
        setCardBackgroundColor(parseFloat(forecast[2].day.avgtemp_c), theDayAfterDiv);

        tomorrowDiv.innerHTML = '';
        theDayAfterDiv.innerHTML = '';

        forecast.slice(1, 3).forEach((forecastDay, index) => {
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('ac_forecastCard');
            forecastCard.innerHTML = `
                        <h3>${index === 0 ? 'Tomorrow' : 'The Day After'}</h3>
                        <p>Date: ${forecastDay.date}</p>
                        <p>Min Temperature: ${forecastDay.day.mintemp_c}&deg;C</p>
                        <p>Max Temperature: ${forecastDay.day.maxtemp_c}&deg;C</p>
                        <p>Average Temperature: ${forecastDay.day.avgtemp_c}&deg;C</p>
                        <p>Max Wind Speed: ${forecastDay.day.maxwind_kph} km/h</p>
                        <p>Average Humidity: ${forecastDay.day.avghumidity}</p>
                    `;
            if (index === 0) {
                tomorrowDiv.appendChild(forecastCard);
            } else {
                theDayAfterDiv.appendChild(forecastCard);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

window.onload = function () {
    displayWeather();
};

async function convertCurrency() {
    const fromCurrency = document.getElementById('ac_fromCurrency').value;
    const toCurrency = document.getElementById('ac_toCurrency').value;
    const amount = document.getElementById('ac_amount').value;
    const conversionResultDiv = document.getElementById('ac_conversionResult');

    const url = `https://currency-exchange.p.rapidapi.com/exchange?from=${fromCurrency}&to=${toCurrency}&q=${amount}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3df6feeb79mshd8b36d9595f9396p10f4f4jsnc42486578bab',
            'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        conversionResultDiv.textContent = `Converted Amount: ${result}`;
    } catch (error) {
        console.error(error);
        conversionResultDiv.textContent = 'An error occurred. Please try again.';
    }
}