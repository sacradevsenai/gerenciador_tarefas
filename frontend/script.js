const apiUrl = 'http://localhost:3000/task'; // declaração da rota para o backend

// constantes para comunicar com identificadores no html

const form = document.getElementById('task-form'); 
const taskList = document.getElementById('task-list');

// ação para ouvir o botão submit do form e pegar os valores nos inputs

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    try {
        const res = await fetch(apiUrl, {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({title, description})
        });

        if (!res.ok) throw new Error('Erro ao adicionar tarefa');

        const task = await res.json();
        form.reset();

        addTaskToUl(task);

    } catch (err) {
        alert('Error ao salvar tarefa: ' + err.message);
    }
})

function addTaskToUl(task) {
    const li = document.createElement('li');
    li.className = task.completed ? "completed" : "";

    const description = task.description ? task.description.trim() : "";

    const text = description ? `${task.title} - ${task.description}` : task.title;

    li.innerHTML = `
    <span>${text}</span>
    <div>
        <button onclick = 'toggleComplete(${task.id}, ${task.complete})'>✔️
        </button>
        <button onclick = 'deleteTask(${task.id})'>🗑️</button>
        </button>
        
    </div>
    `;
    taskList.appendChild(li);
};

async function loadTasks() {
    try {
        const res = await fetch(apiUrl);

        if (!res.ok) throw new Error("Erro ao carregar tarefas");
        const tasks = await res.json();

        taskList.innerHTML = "";
        tasks.forEach(addTaskToUl);
    } catch (err) {
        alert("Erro ao carregar tarefas" + err.message);        
    }
};

async function toggleComplete(id,completed) {
    try {
        const res = await fetch(`${apiUrl}/${id}`);
        const task = await res.json();

        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                title: task.title, 
                description: task.description,
                completed: !completed
            })
        });
        loadTasks();

    } catch (err) {
        alert('Erro ao atualizar tarefa: ' + err.message)
    }
}


async function deleteTask(id, deleted) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        
        loadTasks();

    } catch (err) {
        alert('Erro ao excluir tarefa ' + err.message)
    }
    
}
//