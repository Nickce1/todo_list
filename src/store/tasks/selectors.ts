import type { RootState } from "@/store/types";

export const selectTasks = (state: RootState) => state.tasks.items;
export const selectTasksStatus = (state: RootState) => state.tasks.status;
export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectTaskById = (state: RootState, id: string) =>
  state.tasks.items.find((task) => task.id === id);
