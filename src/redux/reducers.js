import { combineReducers } from "redux";

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

export const Reducers = combineReducers({
  reservations: reservationsReducer
});
