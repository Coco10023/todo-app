export type Priority = 1 | 2 | 3;
export interface Todo {
    task: string;
    completed: boolean;
    priority: Priority;
    createdAt: string; 
    completedAt: string | null; 
}