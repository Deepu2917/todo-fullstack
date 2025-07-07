const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

const API = "https://realtime-editor-backend-055w.onrender.com/todos";

// Load existing todos
async function loadTodos() {
  const res = await fetch(API);
  const todos = await res.json();
  list.innerHTML = "";
  todos.forEach(addTodoToDOM);
}

// Add new todo
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const todo = await res.json();
  addTodoToDOM(todo);
  input.value = "";
});

// Add todo to DOM
function addTodoToDOM(todo) {
  const li = document.createElement("li");
  li.textContent = todo.text;
  if (todo.done) li.classList.add("done");

  li.addEventListener("click", async () => {
    await fetch(`${API}/${todo._id}`, { method: "PUT" });
    li.classList.toggle("done");
  });

  const del = document.createElement("button");
  del.textContent = "❌";
  del.addEventListener("click", async (e) => {
    e.stopPropagation();
    await fetch(`${API}/${todo._id}`, { method: "DELETE" });
    li.remove();
  });

  li.appendChild(del);
  list.appendChild(li);
}

loadTodos();
