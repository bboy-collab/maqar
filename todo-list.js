document.addEventListener('DOMContentLoaded', function() {
    const addListButton = document.getElementById('addListButton');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const listContainer = document.getElementById('listContainer');

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();

        if (!taskText) {
            return;
        }

        const li = document.createElement('li');

        li.innerHTML = `
            <input type="checkbox" class="taskCheckbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.taskCheckbox');
        const editButton = li.querySelector('.edit-btn');
        const deleteButton = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('span');

        if (completed) {
            li.classList.add('completed');
            editButton.disabled = true;
            editButton.style.opacity = 0.5;
            editButton.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;

            li.classList.toggle('completed', isChecked);
            editButton.disabled = isChecked;
            editButton.style.opacity = isChecked ? 0.5 : 1;
            editButton.style.pointerEvents = isChecked ? 'none' : 'auto';
        });

        editButton.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = taskSpan.textContent;
                li.remove();
            }
        });

        deleteButton.addEventListener('click', () => {
            li.remove();
        });

        taskList.appendChild(li);
        taskInput.value = '';
    };

    addTaskButton.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
});