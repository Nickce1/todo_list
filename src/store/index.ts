import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { filtersReducer } from "@/store/filters/slice";
import { rootSaga } from "@/store/root-saga";
import { tasksReducer } from "@/store/tasks/slice";

export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      tasks: tasksReducer,
      filters: filtersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type { RootState } from "@/store/types";
export type AppDispatch = AppStore["dispatch"];
