import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { DB } from "../x/firebase";

const S = styled.div`
  margin: 20px;
  box-shadow: var(--shadow);
  padding: 10px;
  border-radius: 5px;
  div {
    outline: none;
    margin: 10px;
  }
`;
export const Note = ({ uid }) => {
  let timer;

  let saveToCLoud = x => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      DB.note(uid, x);
    }, 1000);
  };

  let saveLocal = x => {
    console.log(x);
  };

  return (
    <S>
      Note...
      <div
        contentEditable="true"
        onInput={e => {
          if (uid) {
            saveToCLoud(e.currentTarget.textContent);
          } else {
            saveLocal(e.currentTarget.textContent);
          }
        }}
      />
    </S>
  );
};
