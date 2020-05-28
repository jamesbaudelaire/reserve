import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { DB } from "../x/firebase";

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
export const Note = ({ uid, day }) => {
  let timer;

  // let saveToCLoud = x => {
  //   clearTimeout(timer);
  //   timer = setTimeout(() => {
  //     DB.note(uid, x);
  //   }, 1000);
  // };

  let saveLocal = x => {
    console.log(x);
  };

  return (
    <S>
      Note...
      <div
        className="note"
        contentEditable="true"
        onInput={e => {
          if (uid) {
            // saveToCLoud(e.currentTarget.textContent);
          } else {
            saveLocal(e.currentTarget.textContent);
          }
        }}
      />
      <div className="date">{day && `${day.month}/${day.day}/${day.year}`}</div>
    </S>
  );
};
