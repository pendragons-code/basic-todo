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
const clearAllButton = document.getElementById('clear-all') as HTMLButtonElement;

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
    const target = event.target as HTMLButtonElement;
    const clickedTaskIndex = parseInt(target.dataset.index);

    if (!isNaN(clickedTaskIndex)) {
        if (target.classList.contains('task-button')) {
            tasks[clickedTaskIndex].completed = !tasks[clickedTaskIndex].completed;
            saveTasksToLocalStorage();
            renderTasks();
        } else if (target.classList.contains('delete-button')) {
            tasks.splice(clickedTaskIndex, 1);
            saveTasksToLocalStorage();
            renderTasks();
        } else if (target.classList.contains('edit-button')) {
            const newTaskName = prompt('Enter the new task name:', tasks[clickedTaskIndex].taskName);
            if (newTaskName !== null) {
                editTask(clickedTaskIndex, newTaskName);
            }
        } else if (target.classList.contains('update-button')) {
            const newTaskName = prompt('Enter the updated task name:', tasks[clickedTaskIndex].taskName);
            if (newTaskName !== null) {
                editTask(clickedTaskIndex, newTaskName);
            }
        }
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
    tasks = [];
    saveTasksToLocalStorage();
    renderTasks();
});

function editTask(index: number, newTaskName: string) {
    tasks[index].taskName = newTaskName;
    saveTasksToLocalStorage();
    renderTasks();
}

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
                <span class="${task.completed ? 'completed' : ''}">${task.taskName}</span>
                <button class="delete-button" data-index="${index}">Delete</button>
                <button class="update-button" data-index="${index}">Update</button>
                <button class="edit-button" data-index="${index}">Edit</button>
            `;
            taskList.appendChild(taskElement);
        });
    }
}

// Initial rendering
renderTasks();

