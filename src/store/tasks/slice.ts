import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskUpdates } from "@/lib/tasks";

export type TasksStatus = "idle" | "loading" | "ready" | "failed";

type TasksState = {
  items: Task[];
  status: TasksStatus;
  error: string | null;
};

const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
};

export const loadTasksRequested = createAction("tasks/loadRequested");
export const addTaskRequested = createAction<string>("tasks/addRequested");
export const toggleTaskRequested = createAction<string>("tasks/toggleRequested");
export const deleteTaskRequested = createAction<string>("tasks/deleteRequested");
export const updateTaskRequested = createAction<{
  id: string;
  updates: TaskUpdates;
}>("tasks/updateRequested");

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = "loading";
      state.error = null;
    },
    loadSucceeded(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
      state.status = "ready";
      state.error = null;
    },
    loadFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    tasksUpdated(state, action: PayloadAction<Task[]>) {
      state.items = action.payload;
      state.status = "ready";
      state.error = null;
    },
  },
});

export const { loadStarted, loadSucceeded, loadFailed, tasksUpdated } =
  tasksSlice.actions;

export const tasksReducer = tasksSlice.reducer;
