const currentURL = window.location.href;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href === currentURL) {
        link.classList.add('active'); 
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const addListButton = document.getElementById("addListButton");
    const projectName = document.getElementById("projectName");
    const listSection = document.getElementById("listSection");
    const listTemplate = document.getElementById("listContainer");


    listTemplate.style.display = "none";


    addListButton.addEventListener("click", () => {

        const name = projectName.value.trim();

        if (!name) {
            alert("Enter a project name.");
            return;
        }

        createList(name);

        projectName.value = "";

        saveAllLists();

    });

    function createList(name, tasks = []) {

    const list = listTemplate.cloneNode(true);

    list.removeAttribute("id");
    list.classList.remove("list-template");   
    list.style.display = "flex";

    list.querySelector(".project-title").textContent = name;

    setupList(list);

    listSection.appendChild(list);

    tasks.forEach(task => {
        list.addTask(task.text, task.completed, false);
    });

    list.updateProgress(false);

    }


    function setupList(list) {

        const addTaskButton = list.querySelector("#addTaskButton");
        const taskInput = list.querySelector("#taskInput");
        const taskList = list.querySelector("#taskList");
        const progressBar = list.querySelector("#progress");
        const progressNumbers = list.querySelector("#numbers");
        const deleteListButton = list.querySelector(".delete-list-btn");

        function updateProgress(checkCompletion = true) {

            const total = taskList.children.length;

            const completed =
                taskList.querySelectorAll(".taskCheckbox:checked").length;

            progressBar.style.width =
                total ? `${completed / total * 100}%` : "0%";

            progressNumbers.textContent =
                `${completed} / ${total}`;

            if (
                checkCompletion &&
                total > 0 &&
                completed === total
            ) {
                launchConfetti();
            }

        }

        list.updateProgress = updateProgress;

        function addTask(text = "", completed = false, checkCompletion = true) {

            const taskText = text || taskInput.value.trim();

            if (!taskText) return;

            const li = document.createElement("li");

            li.innerHTML = `
                <input type="checkbox" class="taskCheckbox" ${completed ? "checked" : ""}>

                <span>${taskText}</span>

                <div class="task-buttons">

                    <button class="edit-btn">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button class="delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;

            const checkbox = li.querySelector(".taskCheckbox");
            const editButton = li.querySelector(".edit-btn");
            const deleteButton = li.querySelector(".delete-btn");
            const span = li.querySelector("span");
                        if (completed) {

                li.classList.add("completed");

                editButton.disabled = true;
                editButton.style.opacity = 0.5;
                editButton.style.pointerEvents = "none";

            }

            checkbox.addEventListener("change", () => {

                const checked = checkbox.checked;

                li.classList.toggle("completed", checked);

                editButton.disabled = checked;
                editButton.style.opacity = checked ? 0.5 : 1;
                editButton.style.pointerEvents =
                    checked ? "none" : "auto";

                updateProgress();

                saveAllLists();

            });

            editButton.addEventListener("click", () => {

                if (checkbox.checked) return;

                taskInput.value = span.textContent;

                li.remove();

                updateProgress(false);

                saveAllLists();

            });

            deleteButton.addEventListener("click", () => {

                li.remove();

                updateProgress();

                saveAllLists();

            });

            taskList.appendChild(li);

            taskInput.value = "";

            updateProgress(checkCompletion);

            saveAllLists();

        }

        list.addTask = addTask;

        addTaskButton.addEventListener("click", e => {

            e.preventDefault();

            addTask();

        });

        taskInput.addEventListener("keydown", e => {

            if (e.key === "Enter") {

                e.preventDefault();

                addTask();

            }

        });

        deleteListButton.addEventListener("click", () => {

        list.remove();

        saveAllLists();

});



    }

     function saveAllLists() {

        const allLists = [];
        console.log("Saving...");
        console.log(listSection.innerHTML);

        listSection.querySelectorAll(".listContainer").forEach(list => {

            if (list.classList.contains("list-template")) return;

            const name =
                list.querySelector(".project-title").textContent;
                console.log("Found list:", name);

            const tasks = Array.from(
                list.querySelectorAll("#taskList li")
            ).map(li => ({

                text: li.querySelector("span").textContent,

                completed:
                    li.querySelector(".taskCheckbox").checked

            }));

            allLists.push({

                name,
                tasks

            });

        });

        console.log(allLists);
        localStorage.setItem(
            "todoLists",
            JSON.stringify(allLists)
        );

    }

    function loadAllLists() {

        const savedLists = JSON.parse(
            localStorage.getItem("todoLists")
        ) || [];

        savedLists.forEach(list => {

            createList(list.name, list.tasks);

        });

    }

    loadAllLists();

});

let confettiPlaying = false;

function launchConfetti() {

    if (confettiPlaying) return;

    confettiPlaying = true;

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {

        const timeLeft = animationEnd - Date.now();

        const ticks = Math.max(200, 500 * (timeLeft / duration));

        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks,
            origin: {
                x: Math.random(),
                y: Math.random() * skew - 0.2
            },
            colors: ["#ffffff"],
            shapes: ["circle"],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });

        if (timeLeft > 0) {
            requestAnimationFrame(frame);
        } else {
            confettiPlaying = false;
        }

    })();

}