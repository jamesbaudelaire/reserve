import { combineReducers } from "redux";

const dayReducer = (state = {}, action) => {
  switch (action.type) {
    case "setDay":
      return (state = action.data);
    default:
      return state;
  }
};

const reservationsReducer = (state = [], action) => {
  switch (action.type) {
    case "setReservations":
      return [...state, ...action.data];

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
  day: dayReducer,
  reservations: reservationsReducer
});
