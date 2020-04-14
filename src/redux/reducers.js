import { combineReducers } from "redux";

import { data } from "../data";

let day = {};

const dayReducer = (state = day, action) => {
  switch (action.type) {
    case "set":
      return (state = action.data);
    default:
      return state;
  }
};

const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case "get":
      let business = data[action.data];
      if (business) {
        return business;
      } else {
        return state;
      }
    case "add":
      let x = state;

      if (x.reservations.find(r => r.id === action.data.id)) {
        x.reservations = x.reservations.filter(r => r.id !== action.data.id);
      }

      x.reservations.push(action.data);
      return { ...state, x };
    case "arrived":
      let y = state;
      y.reservations.forEach(r => {
        if (r.id === action.data) {
          r.arrived = !r.arrived;
        }
      });
      return { ...state, y };
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  day: dayReducer,
  data: dataReducer
});
