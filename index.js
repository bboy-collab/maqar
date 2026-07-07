
// Get the current URL
const currentURL = window.location.href;

// Get all the navigation links
const navLinks = document.querySelectorAll('nav a');

// Loop through each link and check if it matches the current URL
navLinks.forEach(link => {
    if (link.href === currentURL) {
        link.classList.add('active'); // Add 'active' class to the matching link
    }
});

