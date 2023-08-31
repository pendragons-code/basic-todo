interface Task {
    taskName: string;
    completed: boolean;
}

const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const taskList = document.getElementById('task-list') as HTMLDivElement;
const filterAllButton = document.getElementById('filter-all') as HTMLButtonElement;
const filterActiveButton = document.getElementById('filter-active') as HTMLButtonElement;
const filterCompletedButton = document.getElementById('filter-completed') as HTMLButtonElement;
const clearAllButton = document.getElementById('clear-all') as HTMLButtonElement; // New button

let tasks: Task[] = [];

window.addEventListener('load', () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
});

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTaskName = taskInput.value.trim();
    if (newTaskName !== '') {
        tasks.push({ taskName: newTaskName, completed: false });
        saveTasksToLocalStorage();
        renderTasks();
        taskInput.value = '';
    }
});

taskList.addEventListener('click', (event) => {
    const clickedTaskIndex = parseInt((event.target as HTMLButtonElement).dataset.index);
    if (!isNaN(clickedTaskIndex)) {
        tasks[clickedTaskIndex].completed = !tasks[clickedTaskIndex].completed;
        saveTasksToLocalStorage();
        renderTasks();
    }
});

filterAllButton.addEventListener('click', () => {
    renderTasks();
});

filterActiveButton.addEventListener('click', () => {
    const activeTasks = tasks.filter(task => !task.completed);
    renderTasks(activeTasks);
});

filterCompletedButton.addEventListener('click', () => {
    const completedTasks = tasks.filter(task => task.completed);
    renderTasks(completedTasks);
});

clearAllButton.addEventListener('click', () => {
    tasks = []; // Clear the tasks array
    saveTasksToLocalStorage();
    renderTasks();
});

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filteredTasks: Task[] = tasks) {
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        const noTasksElement = document.createElement('div');
        noTasksElement.classList.add('no-tasks');
        noTasksElement.textContent = 'No tasks to display.';
        taskList.appendChild(noTasksElement);
    } else {
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.innerHTML = `
                <button class="task-button" data-index="${index}">
                    ${task.completed ? '✓' : ' '}
                </button>
                <span class="${task.completed ? 'completed' : ''}">${task.taskName}</span>
                <button class="delete-button" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskElement);
        });
    }
}

// Initial rendering
renderTasks();

