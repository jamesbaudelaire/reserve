export const setDay = x => {
  return {
    type: "setDay",
    data: x
  };
};

// export const getData = x => {
//   return {
//     type: "get",
//     data: x
//   };
// };

export const setReservations = x => {
  return {
    type: "setReservations",
    data: x
  };
};

export const getReservations = () => {
  return {
    type: "getReservations"
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
