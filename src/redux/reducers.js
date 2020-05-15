import { createStore, combineReducers } from "redux";

import { LS } from "../x/functions";

const reservationsReducer = (state = [], action) => {
  switch (action.type) {
    case "loadReservations":
      return [...action.data];

    case "addReservation":
      if (state.find(r => r.id === action.data.id)) {
        state = state.filter(r => r.id !== action.data.id);
      }
      return [...state, action.data];

    case "deleteReservation":
      return state.filter(r => r.id !== action.data);

    default:
      return state;
  }
};

const appReducer = (state = { uid: null }, action) => {
  switch (action.type) {
    case "set":
      state.uid = action.data;
      return state;
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  reservations: reservationsReducer,
  app: appReducer
});

export const store = createStore(Reducers);

store.subscribe(() => {
  LS.saveReservations(store.getState().reservations);
});
