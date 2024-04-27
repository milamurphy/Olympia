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
function loadMap() {
    let dkitLocation = { lat: 53.98485693, lng: -6.39410164 }


    let map = new google.maps.Map(document.getElementById("map"), {
        mapId: "MY_MAP_ID",
        zoom: 16,
        center: dkitLocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hide_poi"]
        }
    })

    hidePointsOfInterest(map)

    let infoWindow = null

    let marker = new google.maps.marker.AdvancedMarkerElement({
        position: dkitLocation,
        map: map
    })

    if (infoWindow === null) {
        infoWindow = new google.maps.InfoWindow()
    }

    google.maps.event.addListener(marker, "click", () => {
        infoWindow.setContent("DkIT")
        infoWindow.open(map, marker)
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
}

function translateIntoFrench() {
    const englishText = encodeURI(document.getElementById('englishText').value)
    const tranlationLanuage = `fr`
    const url = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyDR2wBzU8CxxOwi3Pb241I5Se0Ke6W5=${englishText}&source=en&target=${tranlationLanuage}`

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            document.getElementById('frenchTranslationContainer').style.display = 'block'
            document.getElementById('translation').innerHTML = `<input type="text" readonly id="translation" value="${jsonData.data.translations[0].translatedText}"/>`

        })
}