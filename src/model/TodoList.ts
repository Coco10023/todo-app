import type { Todo, Priority } from "./Todo"; 

export class TodoList {  // Skapar klassen TodoList
    private todos: Todo[]; // Detta är arrayen där ala todos sparas och private innebär att den bara får användas inne i klassen. 
    private readonly storageKey: string = "todos"; // Det här är nyckeln som används i localStorage och readonly betyder att värdet inte ska ändras efter att det sätts. 


constructor() { // Skapar ett TodoList objekt
    this.todos = []; // todos börjar som en tom array 
    this.loadFromLocalStorage(); // gamla todos laddas in från localStorage så när sidan laddas om finns uppgifterna kvar
}

public addTodo(task: string, priority: number): boolean { // Denna metod lägger till en ny todo samt tar emot text och prioritet. 
    const trimmedTask = task.trim(); // Texten trimmas med trim() ifall användaren exempelvis bara skriver mellanslag vill jag inte godkänna det som en uppgift 

    if (!trimmedTask) { // Kontrollerar att texten inte är tom 
      return false;
    }

    if (!this.isValidPriority(priority)) { // Kontrollerar att texten är 1-3 
      return false;
    }

    const newTodo: Todo = { // Skapar ett nytt objekt 
      task: trimmedTask,
      completed: false,
      priority: priority as Priority,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    this.todos.push(newTodo); // Lägger till objektet newTodo på arrayen todos
    this.saveToLocalStorage(); // Sparar i localStorage 
    return true; // returnerar true men om något är fel returneras false
  }

  public markTodoCompleted(todoIndex: number): void {
    if (!this.isValidIndex(todoIndex)) {
      return;
    }

    const todo = this.todos[todoIndex];
    todo.completed = !todo.completed;   // Betyder att om den är false blir den true, om den är true blir den false. 
    // Gör att samma knapp fungerar för att både markera klar och ångra.
    todo.completedAt = todo.completed ? new Date().toISOString() : null;

    this.saveToLocalStorage();
  }

  public removeTodo(todoIndex: number): void { // Tar bort en todo från listan
    if (!this.isValidIndex(todoIndex)) {
      return;
    }

    this.todos.splice(todoIndex, 1);  // Börjar på position todoIndex och tar bort 1 element
    this.saveToLocalStorage(); // Sedan sparas listan igen 
  }

  public editTodo(todoIndex: number, newTask: string, newPriority: number): boolean {  // Metoden låter mig redigera en befintlig todo. 
    const trimmedTask = newTask.trim();

    if (!this.isValidIndex(todoIndex)) { // Kontrollerar att indexet finns
      return false;
    }

    if (!trimmedTask) { // Kontrollerar att texten inte är tom 
      return false;
    }

    if (!this.isValidPriority(newPriority)) { // Kontrollerar att prioriteten är giltig 
      return false;
    }

    this.todos[todoIndex].task = trimmedTask; // Om allt är rätt uppdateras task eller priority
    this.todos[todoIndex].priority = newPriority as Priority;
    this.saveToLocalStorage(); // Ändringen sparar i localStorage 
    return true;
  }

  public getTodos(): Todo[] {  // Denna metod returnerar alla todos
    return [...this.todos]; // Returnerar en kopia av arrayen med [...] istället för originalet för att skydda datan lite
  }

  public saveToLocalStorage(): void {  
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));  // localStorage kan bara spara text så jag om arrayen till JSON-text med JSON.stringify()
  }

  public loadFromLocalStorage(): void {  // Laddar sparade todos
    const savedTodos = localStorage.getItem(this.storageKey);  // Hämtar från localStorage 

    if (!savedTodos) { // Om inget finns är det en tom array 
      this.todos = [];
      return;
    }

    try {  // try och catch används för att undvika att appen kraschar om datan i localStorage är trasig
      const parsedTodos: unknown = JSON.parse(savedTodos);  // Försöker tolka texten med JSON.parse

      if (Array.isArray(parsedTodos)) {  // Kontrollera at resultatet är en array 
        this.todos = parsedTodos.filter(this.isTodo);  // Filtrera så att bara giltiga todos sparas
      } else {
        this.todos = [];
      }
    } catch {  
      this.todos = [];
    }
  }

  private isValidPriority(priority: number): boolean {  
    return Number.isInteger(priority) && priority >= 1 && priority <= 3;  // Kontrollerar att prioriteten är ett heltal och är mellan 1 och 3
  }

  private isValidIndex(index: number): boolean {  // 
    return Number.isInteger(index) && index >= 0 && index < this.todos.length; // Kontrollerar att indexet är ett heltal, inte är mindre än 0 och inte är större än arrayens längd
  }

  private isTodo = (value: unknown): value is Todo => {  // Använder type guard som används för att kontrollera att något verkligen ser ut som en Todo, bra vid hämtning av data 
  // från localStorage. För att man inte alltid kan lita på att datan är korrekt. 
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const todo = value as Record<string, unknown>;

    return (
      typeof todo.task === "string" &&
      typeof todo.completed === "boolean" &&
      (todo.priority === 1 || todo.priority === 2 || todo.priority === 3) &&
      typeof todo.createdAt === "string" &&
      (typeof todo.completedAt === "string" || todo.completedAt === null)
    );
  };
}
