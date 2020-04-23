import { createStore, combineReducers } from "redux";

import { LS } from "../functions";

const reservationsReducer = (state = [], action) => {
  switch (action.type) {
    case "loadReservations":
      return [...action.data];

    case "addReservation":
      if (state.find(r => r.id === action.data.id)) {
        state = state.filter(r => r.id !== action.data.id);
      }
      return [...state, action.data];

    case "arrived":
      let x = state.map(r =>
        r.id === action.data ? { ...r, arrived: !r.arrived } : r
      );
      return x;

    default:
      return state;
  }
};

const appReducer = (state = { uid: null }, action) => {
  switch (action.type) {
    case "uid":
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
