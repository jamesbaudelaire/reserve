export const loadReservations = x => {
  return {
    type: "loadReservations",
    data: x
  };
};

export const addReservation = x => {
  return {
    type: "addReservation",
    data: x
  };
};

export const deleteReservation = x => {
  return {
    type: "deleteReservation",
    data: x
  };
};

export const setuid = x => {
  return {
    type: "set",
    data: x
  };
};
