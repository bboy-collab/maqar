const currentURL = window.location.href;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href === currentURL) {
        link.classList.add('active'); 
    }
});

let notes = []

function loadNotes(){
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event){
    event.preventDefault()

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    });
    renderNotes();
}

function generateId(){
    return Date.now().toString()
}

function saveNotes(){
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function renderNotes(){
    const notesContainer = document.getElementById('notesContainer');

    notesContainer.innerHTML = notes.map(note =>`
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
        </div>`
    ).join('')
}

function openNoteDialog() {
    const dialog = document.getElementById('noteDialog')
    const titleInput = document.getElementById('noteTitle')
    const contentInput = document.getElementById('noteContent')

    dialog.showModal()
    titleInput.focus()
};

function closeNoteDialog(){
    document.getElementById('noteDialog').close()
}

document.addEventListener('DOMContentLoaded', function(){
    notes=loadNotes()
    renderNotes()

    document.getElementById('noteForm').addEventListener('submit', saveNote)

    document.getElementById('noteDialog').addEventListener('click', function(event){
        if(event.target === this){
            closeNoteDialog()
        }
    })
});