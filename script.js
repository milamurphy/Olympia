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

        if (window.innerWidth < 800) {
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