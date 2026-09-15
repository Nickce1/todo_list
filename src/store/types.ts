import type { filtersReducer } from "@/store/filters/slice";
import type { tasksReducer } from "@/store/tasks/slice";

export type RootState = {
  tasks: ReturnType<typeof tasksReducer>;
  filters: ReturnType<typeof filtersReducer>;
};
