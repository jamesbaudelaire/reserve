import { combineReducers } from "redux";

let day = {};

const dayReducer = (state = day, action) => {
  switch (action.type) {
    case "set":
      return (state = action.data);
    default:
      return state;
  }
};

export const Reducers = combineReducers({
  day: dayReducer
});
