const currentURL = window.location.href;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href === currentURL) {
        link.classList.add('active'); 
    }
});

let notes = []

function openNoteDialog() {
    const dialog = document.getElementById('noteDialog')
    const titleInput = document.getElementById('noteTitle')
    const contentInput = document.getElementById('noteContent')

    dialog.showModal()
    titleInput.focus()
}