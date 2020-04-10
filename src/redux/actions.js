export const setDay = x => {
  return {
    type: "set",
    data: x
  };
};

export const getData = x => {
  return {
    type: "get",
    data: x
  };
};

export const addReservation = x => {
  return {
    type: "add",
    data: x
  };
};
