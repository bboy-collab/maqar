const currentURL = window.location.href;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href === currentURL) {
        link.classList.add('active'); 
    }
});