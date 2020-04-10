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
      x.reservations.push(action.data);
      return { ...state, x };
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  day: dayReducer,
  data: dataReducer
});
