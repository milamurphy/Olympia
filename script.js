window.onscroll = function () {
    var navbar = document.querySelector('.navbar');
    var logo = document.querySelector('.logo');
    var paristext = document.querySelector('.paristext');
    var scrollPosition = window.scrollY;

    if (scrollPosition > 200) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        navbar.style.fontSize = '22px';
        logo.style.height= '4vh'
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.fontSize = '25px';
        logo.style.height= '5vh';
    }

    if (scrollPosition > 100) {
        paristext.style.opacity = '0';
        paristext.style.transform = 'translate(-50%, -100%)';
    } else {
        paristext.style.opacity = '1';
        paristext.style.transform = 'translate(-50%, -50%)';
    }
}