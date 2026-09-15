import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { createTask, type Task } from "@/lib/tasks";
import { tasksApi } from "@/store/tasks/api";
import { selectTasks } from "@/store/tasks/selectors";
import {
  addTaskRequested,
  deleteTaskRequested,
  loadFailed,
  loadStarted,
  loadSucceeded,
  loadTasksRequested,
  tasksUpdated,
  toggleTaskRequested,
  updateTaskRequested,
} from "@/store/tasks/slice";

function* persistTasks(tasks: Task[]) {
  yield call(tasksApi.persist, tasks);
  yield put(tasksUpdated(tasks));
}

function* loadTasksSaga() {
  try {
    yield put(loadStarted());
    const tasks: Task[] = yield call(tasksApi.fetchAll);
    yield put(loadSucceeded(tasks));
  } catch {
    yield put(loadFailed("Could not load tasks."));
  }
}

function* addTaskSaga(action: ReturnType<typeof addTaskRequested>) {
  const title = action.payload.trim();

  if (!title) {
    return;
  }

  const items: Task[] = yield select(selectTasks);
  yield* persistTasks([createTask(title), ...items]);
}

function* toggleTaskSaga(action: ReturnType<typeof toggleTaskRequested>) {
  const items: Task[] = yield select(selectTasks);
  yield* persistTasks(
    items.map((task) =>
      task.id === action.payload
        ? { ...task, completed: !task.completed }
        : task,
    ),
  );
}

function* deleteTaskSaga(action: ReturnType<typeof deleteTaskRequested>) {
  const items: Task[] = yield select(selectTasks);
  yield* persistTasks(items.filter((task) => task.id !== action.payload));
}

function* updateTaskSaga(action: ReturnType<typeof updateTaskRequested>) {
  const { id, updates } = action.payload;
  const items: Task[] = yield select(selectTasks);
  const nextTasks = items.map((task) =>
    task.id === id
      ? {
          ...task,
          title: updates.title,
          description: updates.description,
          completed: updates.completed,
          dueDate: updates.dueDate,
          urgency: updates.urgency,
        }
      : task,
  );

  if (nextTasks.every((task, index) => task === items[index])) {
    return;
  }

  yield* persistTasks(nextTasks);
}

export function* tasksSaga() {
  yield takeLatest(loadTasksRequested.type, loadTasksSaga);
  yield takeEvery(addTaskRequested.type, addTaskSaga);
  yield takeEvery(toggleTaskRequested.type, toggleTaskSaga);
  yield takeEvery(deleteTaskRequested.type, deleteTaskSaga);
  yield takeEvery(updateTaskRequested.type, updateTaskSaga);
}
