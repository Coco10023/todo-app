// Importerar CSS så Vite inkluderar den i projektet
import "./styles/style.css";

// Importerar vår klass som innehåller all logik
import { TodoList } from "./TodoList";

// Skapar en instans av TodoList (kör constructor → laddar localStorage)
const todoList = new TodoList();

// Hämtar HTML-element från sidan
const form = document.querySelector<HTMLFormElement>("#todo-form");
const taskInput = document.querySelector<HTMLInputElement>("#task");
const priorityInput = document.querySelector<HTMLSelectElement>("#priority");
const todoContainer = document.querySelector<HTMLDivElement>("#todo-list");
const errorMessage = document.querySelector<HTMLParagraphElement>("#error-message");
const filterSelect = document.querySelector<HTMLSelectElement>("#filter");


// Funktion för att formatera datum till ett mer läsbart format
function formatDate(dateString: string | null): string {
  if (!dateString) {
    return "-"; // Om inget datum finns
  }

  const date = new Date(dateString);
  return date.toLocaleString("sv-SE"); // Svenskt datumformat
}


// Funktion som översätter prioritet (1,2,3) till text
function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1:
      return "Hög";
    case 2:
      return "Medel";
    case 3:
      return "Låg";
    default:
      return "Okänd";
  }
}


// Renderar alla todos på sidan
function renderTodos(): void {
  // Säkerställer att element finns
  if (!todoContainer || !filterSelect) {
    return;
  }

  // Hämtar todos från klassen
  const todos = todoList.getTodos();

  // Hämtar aktuellt filtervärde
  const filterValue = filterSelect.value;

  // Filtrerar todos beroende på valt filter
  const filteredTodos = todos.filter((todo) => {
    if (filterValue === "completed") {
      return todo.completed;
    }

    if (filterValue === "active") {
      return !todo.completed;
    }

    return true; // visa alla
  });

  // Om inga todos finns
  if (filteredTodos.length === 0) {
    todoContainer.innerHTML = `<p class="empty-state">Inga uppgifter att visa.</p>`;
    return;
  }

  // Bygger HTML för varje todo
  todoContainer.innerHTML = filteredTodos
    .map((todo) => {
      // Hittar rätt index i original-arrayen
      const realIndex = todos.findIndex(
        (item) =>
          item.task === todo.task &&
          item.createdAt === todo.createdAt &&
          item.priority === todo.priority
      );

      return `
        <article class="todo-card ${todo.completed ? "completed" : ""}">
          <div class="todo-card__top">
            <div>
              <h2>${todo.task}</h2>
              <p class="meta">Prioritet: ${getPriorityLabel(todo.priority)} (${todo.priority})</p>
              <p class="meta">Skapad: ${formatDate(todo.createdAt)}</p>
              <p class="meta">Färdig: ${formatDate(todo.completedAt)}</p>
            </div>

            <!-- Status badge -->
            <span class="status ${todo.completed ? "done" : "pending"}">
              ${todo.completed ? "Klar" : "Pågår"}
            </span>
          </div>

          <!-- Knappar -->
          <div class="todo-card__actions">
            <button class="btn" data-action="toggle" data-index="${realIndex}">
              ${todo.completed ? "Ångra klar" : "Markera klar"}
            </button>

            <button class="btn btn-secondary" data-action="edit" data-index="${realIndex}">
              Redigera
            </button>

            <button class="btn btn-danger" data-action="delete" data-index="${realIndex}">
              Ta bort
            </button>
          </div>
        </article>
      `;
    })
    .join(""); // Slår ihop allt till en string
}


// Visar felmeddelande på sidan
function showError(message: string): void {
  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = message;
}


// Tar bort felmeddelande
function clearError(): void {
  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = "";
}


// När formuläret skickas
form?.addEventListener("submit", (event) => {
  event.preventDefault(); // Stoppar sidladdning

  // Hämtar värden från input
  const task = taskInput?.value ?? "";
  const priority = Number(priorityInput?.value ?? 0);

  // Försöker lägga till todo via klassen
  const added = todoList.addTodo(task, priority);

  // Om något gick fel (validering)
  if (!added) {
    showError("Du måste ange en uppgift och välja en prioritet mellan 1 och 3.");
    return;
  }

  clearError();

  // Rensar formuläret
  if (taskInput) {
    taskInput.value = "";
  }

  if (priorityInput) {
    priorityInput.value = "2";
  }

  // Uppdaterar listan
  renderTodos();
});


// Lyssnar på klick i todo-listan (event delegation)
todoContainer?.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  // Hämtar vad som ska göras (toggle/edit/delete)
  const action = target.dataset.action;

  // Hämtar index på todo
  const index = Number(target.dataset.index);

  // Säkerställer att index är giltigt
  if (!Number.isInteger(index)) {
    return;
  }

  // Markera klar / ångra
  if (action === "toggle") {
    todoList.markTodoCompleted(index);
    renderTodos();
    return;
  }

  // Ta bort todo
  if (action === "delete") {
    todoList.removeTodo(index);
    renderTodos();
    return;
  }

  // Redigera todo
  if (action === "edit") {
    const currentTodos = todoList.getTodos();
    const currentTodo = currentTodos[index];

    if (!currentTodo) {
      return;
    }

    // Frågar användaren om ny text
    const newTask = prompt("Redigera uppgift:", currentTodo.task);

    if (newTask === null) {
      return; // användaren avbröt
    }

    // Frågar om ny prioritet
    const newPriorityInput = prompt(
      "Ange ny prioritet (1 = hög, 2 = medel, 3 = låg):",
      String(currentTodo.priority)
    );

    if (newPriorityInput === null) {
      return;
    }

    // Uppdaterar via klassen
    const updated = todoList.editTodo(index, newTask, Number(newPriorityInput));

    if (!updated) {
      showError("Kunde inte uppdatera uppgiften.");
      return;
    }

    clearError();
    renderTodos();
  }
});


// När filter ändras → rendera om listan
filterSelect?.addEventListener("change", () => {
  renderTodos();
});


// Kör direkt när sidan laddas
renderTodos();