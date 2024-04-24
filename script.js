window.onscroll = function () {
    var navbar = document.querySelector('.navbar');
    var logo = document.querySelector('.logo');
    var paristext = document.querySelector('.parisText');
    var scrollPosition = window.scrollY;

    if (scrollPosition > 200) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        navbar.style.fontSize = '22px';
        logo.style.height = '4vh'
        navbar.classList.add('blurFilter');
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.fontSize = '25px';
        logo.style.height = '5vh';
        navbar.classList.remove('blurFilter');
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

    // Tutorial Reference: https://www.youtube.com/watch?v=by-3r2eqMXA
    const bg = document.getElementById('parallax');
    window.addEventListener('scroll', function () {
        let newSize = 105 - window.pageYOffset / 12;
        newSize = Math.max(newSize, 100);
        bg.style.backgroundSize = newSize + '%';
    })
}