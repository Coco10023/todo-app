import type { Todo, Priority } from "./Todo"; 

export class TodoList {
    private todos: Todo[]; 
    private readonly storageKey: string = "todos"; 


constructor() {
    this.todos = []; 
    this.loadFromLocalStorage();
}

public addTodo(task: string, priority: number): boolean {
    const trimmedTask = task.trim();

    if (!trimmedTask) {
      return false;
    }

    if (!this.isValidPriority(priority)) {
      return false;
    }

    const newTodo: Todo = {
      task: trimmedTask,
      completed: false,
      priority: priority as Priority,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    this.todos.push(newTodo);
    this.saveToLocalStorage();
    return true;
  }

  public markTodoCompleted(todoIndex: number): void {
    if (!this.isValidIndex(todoIndex)) {
      return;
    }

    const todo = this.todos[todoIndex];
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? new Date().toISOString() : null;

    this.saveToLocalStorage();
  }

  public removeTodo(todoIndex: number): void {
    if (!this.isValidIndex(todoIndex)) {
      return;
    }

    this.todos.splice(todoIndex, 1);
    this.saveToLocalStorage();
  }

  public editTodo(todoIndex: number, newTask: string, newPriority: number): boolean {
    const trimmedTask = newTask.trim();

    if (!this.isValidIndex(todoIndex)) {
      return false;
    }

    if (!trimmedTask) {
      return false;
    }

    if (!this.isValidPriority(newPriority)) {
      return false;
    }

    this.todos[todoIndex].task = trimmedTask;
    this.todos[todoIndex].priority = newPriority as Priority;
    this.saveToLocalStorage();
    return true;
  }

  public getTodos(): Todo[] {
    return [...this.todos];
  }

  public saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  public loadFromLocalStorage(): void {
    const savedTodos = localStorage.getItem(this.storageKey);

    if (!savedTodos) {
      this.todos = [];
      return;
    }

    try {
      const parsedTodos: unknown = JSON.parse(savedTodos);

      if (Array.isArray(parsedTodos)) {
        this.todos = parsedTodos.filter(this.isTodo);
      } else {
        this.todos = [];
      }
    } catch {
      this.todos = [];
    }
  }

  private isValidPriority(priority: number): boolean {
    return Number.isInteger(priority) && priority >= 1 && priority <= 3;
  }

  private isValidIndex(index: number): boolean {
    return Number.isInteger(index) && index >= 0 && index < this.todos.length;
  }

  private isTodo = (value: unknown): value is Todo => {
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
