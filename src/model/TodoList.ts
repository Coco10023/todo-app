import type { Todo, Priority } from "./Todo"; 

export class TodoList {
    private todos: Todo[]; 
    private readonly storageKey: string = "todos"; 
}

constructor() {
    this.todos = []; 
    this.loadFromLocalStorage();
}

