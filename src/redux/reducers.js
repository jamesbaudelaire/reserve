import { createStore, combineReducers } from "redux";

import { LS } from "../x/functions";
import { notesLS } from "../x/notesLS";

const notesReducer = (state = [], action) => {
  switch (action.type) {
    case "loadNotes":
      return [...action.data];

    case "saveNote":
      let newState = state.filter(n => n.id !== action.data.id);
      newState.push(action.data);
      notesLS.save(newState);

      return newState;

    default:
      return state;
  }
};

const reservationsReducer = (state = [], action) => {
  switch (action.type) {
    case "loadReservations":
      return [...action.data];

    case "addReservation":
      if (state.find(r => r.id === action.data.id)) {
        state = state.filter(r => r.id !== action.data.id);
      }
      let stateAdd = [...state, action.data];
      LS.saveReservations(stateAdd);
      return stateAdd;

    case "deleteReservation":
      let stateDelete = state.filter(r => r.id !== action.data);
      LS.saveReservations(stateDelete);

      return stateDelete;

    default:
      return state;
  }
};

const appReducer = (state = { uid: null }, action) => {
  switch (action.type) {
    case "setUid":
      state.uid = action.data;
      return state;
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  reservations: reservationsReducer,
  app: appReducer,
  notes: notesReducer
});

export const store = createStore(Reducers);

store.subscribe(() => {
  // console.log(store.getState().notes)
  // LS.saveReservations(store.getState().reservations);
});
