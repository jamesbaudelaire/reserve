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
    type: "setUid",
    data: x
  };
};

export const loadNotes = x => {
  return {
    type: "loadNotes",
    data: x
  };
};

export const saveNote = (note, id) => {
  return {
    type: "saveNote",
    data: { note, id }
  };
};
