document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const prioritySelect = document.getElementById("prioritySelect");
    const dueDateInput = document.getElementById("dueDateInput");
    const categorySelect = document.getElementById("categorySelect");
    const descriptionInput = document.getElementById("descriptionInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() !== "") {
        const taskDetails = {
            title: taskInput.value,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value,
            category: categorySelect.value,
            description: descriptionInput.value,
            completed: false
        };

        fetch('/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskDetails),
        })
        .then(response => response.json())
        .then(data => {
            const taskItem = createTaskItem(data);
            taskList.appendChild(taskItem);
            clearTaskInputFields();
            animateTask(taskItem);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function editTask(button) {
    const taskItem = button.parentElement.parentElement;
    const taskId = taskItem.getAttribute('data-task-id');
    const taskDetails = {
        title: taskItem.querySelector('.task-title').textContent,
        priority: taskItem.querySelector('.task-info:nth-child(2) select').value,
        dueDate: taskItem.querySelector('.task-info:nth-child(3) span').textContent,
        category: taskItem.querySelector('.task-info:nth-child(4) select').value,
        description: taskItem.querySelector('.task-info:nth-child(5) span').textContent,
        completed: taskItem.classList.contains('completed')
    };

    fetch(`/edit_task/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskDetails),
    })
    .then(response => response.json())
    .then(data => {
        deleteTask(button);
        const updatedTaskItem = createTaskItem(data);
        taskList.appendChild(updatedTaskItem);
        animateTask(updatedTaskItem);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteTask(button) {
    const taskItem = button.parentElement.parentElement;
    const taskId = taskItem.getAttribute('data-task-id');

    fetch(`/delete_task/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        taskList.removeChild(taskItem);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

