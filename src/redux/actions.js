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

export const arrived = x => {
  return {
    type: "arrived",
    data: x
  };
};

export const uid = x => {
  return {
    type: "uid",
    data: x
  };
};
