import { all } from "redux-saga/effects";
import { tasksSaga } from "@/store/tasks/sagas";

export function* rootSaga() {
  yield all([tasksSaga()]);
}
