import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { FB, DB } from "../x/firebase";

import { saveNote } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const S = styled.div`
  margin: 20px;
  position: relative;
  box-shadow: var(--shadow);
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;

  .note {
    font-size: 16px;
    outline: none;
    margin: 10px 0 25px 0px;
    max-height: 120px;
    overflow: scroll;
    -webkit-user-select: auto;
    box-shadow: var(--inset);
    padding: 10px;
    border-radius: 5px;
  }

  .date {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  @media screen and (min-width: 1000px) {
    position: fixed;
    left: 0;
    top: 50px;
    width: 160px;
  }
`;

let dayId = day => {
  return `${day.year}-${day.month}-${day.day}`;
};

export const Note = ({ uid, day }) => {
  const dispatch = useDispatch();

  let timer;

  let saveCloud = note => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      DB.note(uid, note, dayId(day));
    }, 1000);
  };

  const notes = useSelector(s => s.notes);

  let saveLocal = note => {
    dispatch(saveNote(note, dayId(day)));
  };

  useEffect(() => {
    let input = document.getElementById("note");
    input.innerText = "";
    if (day) {
      if (uid) {
        let detach = FB.firestore()
          .collection("business")
          .doc(uid)
          .collection("notes")
          .doc(`${dayId(day)}`)
          .onSnapshot(q => {
            let note = q.data();
            if (note) {
              input.innerText = note.text;
            }
          });

        return () => detach();
      } else {
        let note = notes.find(({ id }) => id === dayId(day));
        if (note) {
          input.innerText = note.text;
        }
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
            saveCloud(e.currentTarget.innerText);
          } else {
            saveLocal(e.currentTarget.innerText);
          }
        }}
      />
      <div className="date">
        {day && `${day.month + 1}/${day.day}/${day.year}`}
      </div>
    </S>
  );
};
