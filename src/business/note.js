import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { DB } from "../x/firebase";

import { saveNote } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const S = styled.div`
  margin: 20px;
  position: relative;
  box-shadow: var(--shadow);
  padding: 10px;
  border-radius: 5px;

  .note {
    outline: none;
    margin: 10px;
    margin-bottom: 25px;
  }

  .date {
    font-size: 13px;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;

let dayId = day => {
  return `${day.year}-${day.month}-${day.day}`;
};

export const Note = ({ uid, day }) => {
  const dispatch = useDispatch();

  let timer;

  // let saveTopCloud = x => {
  //   clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     DB.note(uid, x);
  //   }, 1000);
  // };

  const notes = useSelector(s => s.notes);

  let saveLocal = note => {
    dispatch(saveNote(note, dayId(day)));
  };

  useEffect(() => {
    let input = document.getElementById("note");
    input.innerText = "";
    if (day) {
      let dayId = `${day.year}-${day.month}-${day.day}`;
      let note = notes.find(({ id }) => id === dayId);
      if (note && note.note) {
        input.innerText = note.note;
      }
    }
  }, [day]);

  return (
    <S>
      Note...
      <div
        id="note"
        className="note"
        contentEditable={true}
        onInput={e => {
          if (uid) {
          } else {
            saveLocal(e.currentTarget.innerText);
          }
        }}
      />
      <div className="date">{day && `${day.month}/${day.day}/${day.year}`}</div>
    </S>
  );
};
