import { loadTasks, saveTasks, type Task } from "@/lib/tasks";

/**
 * Persistence boundary for tasks.
 * Today this uses localStorage; later it can call the Node API instead.
 */
export const tasksApi = {
  fetchAll: async (): Promise<Task[]> => loadTasks(),
  persist: async (tasks: Task[]): Promise<void> => {
    saveTasks(tasks);
  },
};
