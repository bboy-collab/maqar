let allLists = [];

document.addEventListener('DOMContentLoaded', () => {
  
  loadFromStorage();
  renderAllLists();
  setupEventListeners();
  
});


function loadFromStorage() {
  
  const saved = localStorage.getItem('maqarLinks');
  if (saved) {
    allLists = JSON.parse(saved);
  } else {
    allLists = [];
  }
}

function saveToStorage() {
  localStorage.setItem('maqarLinks', JSON.stringify(allLists));
}

function setupEventListeners() {
  document.getElementById('addListButton').addEventListener('click', () => {
    document.getElementById('addGroupDialog').showModal();
  });
  
  document.getElementById('addGroupDialog').addEventListener('close', (event) => {
    handleAddGroupSubmit(event);
  });
  
  document.getElementById('addLinkDialog').addEventListener('close', (event) => {
    handleAddLinkSubmit(event);
  });
}

function closeAddLinkDialog() {
  const dialog = document.getElementById('addLinkDialog');
  document.getElementById('linkTitle').value = '';
  document.getElementById('linkURL').value = '';
  dialog.close();
}

function closeAddGroupDialog() {
  const dialog = document.getElementById('addGroupDialog');
  document.getElementById('groupTitle').value = '';
  dialog.close();
}

function handleAddGroupSubmit(event) {
  const dialog = event.target;
  if (dialog.returnValue === 'default') {
    const titleInput = document.getElementById('groupTitle');
    const title = titleInput.value.trim();
    
    if (title) {
      const newList = {
        id: Date.now(), 
        title: title,
        links: [] 
      };
      
      allLists.push(newList);
      
      saveToStorage();
      
      renderAllLists();
    }
    

    titleInput.value = '';
  }
}

function handleAddLinkSubmit(event) {
  const dialog = event.target;
  
  if (dialog.returnValue === 'default') {
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkURL');
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    
    const listId = parseInt(dialog.dataset.listId);
    
    if (title && url) {
      
      const list = allLists.find(l => l.id === listId);
      
      if (list) {
        
        const newLink = {
          id: Date.now(), 
          title: title,
          url: url
        };
        
        list.links.push(newLink);
        
        saveToStorage();
    
        renderAllLists();
      }
    }
   
    titleInput.value = '';
    urlInput.value = '';
  }
}

function renderAllLists() {
  
  const container = document.querySelector('.listsContainer');

  container.innerHTML = '';
  
  allLists.forEach(list => {
    const listCard = createListCard(list);
    container.appendChild(listCard);
  });
}

function createListCard(list) {
  const card = document.createElement('div');
  card.className = 'linksCard';
  
  const header = document.createElement('div');
  header.className = 'listHeader';
  
  const title = document.createElement('h3');
  title.textContent = list.title;
  
  const buttons = document.createElement('div');
  buttons.className = 'listButtons';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'deleteListButton';
  deleteBtn.textContent = 'X';
  deleteBtn.addEventListener('click', () => {
    deleteList(list.id);
  });
  
  const editBtn = document.createElement('button');
  editBtn.className = 'editListButton';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    editListTitle(list.id);
  });
  
  buttons.appendChild(deleteBtn);
  buttons.appendChild(editBtn);
  
  header.appendChild(title);
  header.appendChild(buttons);
  
  const addLinkBtn = document.createElement('button');
  addLinkBtn.className = 'addLinkButton';
  addLinkBtn.textContent = 'Add Link';
  addLinkBtn.addEventListener('click', () => {
    const dialog = document.getElementById('addLinkDialog');
    dialog.dataset.listId = list.id;
    dialog.showModal();
  });
  
  const linksList = document.createElement('ul');
  linksList.className = 'linksContainer';
  
  list.links.forEach(link => {
    const linkItem = createLinkItem(link, list.id);
    linksList.appendChild(linkItem);
  });
  
  card.appendChild(header);
  card.appendChild(addLinkBtn);
  card.appendChild(linksList);
  
  return card;
}

function createLinkItem(link, listId) {
  const li = document.createElement('li');
  
  const linkElement = document.createElement('a');
  linkElement.href = link.url;
  linkElement.textContent = link.title;
  linkElement.target = '_blank';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.className = 'deleteLinkButton';
  deleteBtn.style.marginLeft = '10px';
  deleteBtn.addEventListener('click', () => {
    deleteLink(listId, link.id);
  });
  
  li.appendChild(linkElement);
  li.appendChild(deleteBtn);
  
  return li;
}

function deleteList(listId) {
  if (confirm('Are you sure you want to delete this list?')) {
    const index = allLists.findIndex(l => l.id === listId);
    
    if (index !== -1) {
      allLists.splice(index, 1);
      
      saveToStorage();
      renderAllLists();
    }
  }
}

function editListTitle(listId) {
  const list = allLists.find(l => l.id === listId);
  
  if (list) {
    const newTitle = prompt('Enter new title:', list.title);
    
    if (newTitle && newTitle.trim()) {
      list.title = newTitle.trim();
      
      saveToStorage();
      renderAllLists();
    }
  }
}

function deleteLink(listId, linkId) {
  const list = allLists.find(l => l.id === listId);
  
  if (list) {
    const index = list.links.findIndex(l => l.id === linkId);
    
    if (index !== -1) {
      list.links.splice(index, 1);
      
      saveToStorage();
      renderAllLists();
    }
  }
}