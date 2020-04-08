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
      return data[action.data];
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  day: dayReducer,
  data: dataReducer
});
