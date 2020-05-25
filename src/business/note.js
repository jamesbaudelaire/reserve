import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
export const Note = () => {
  const [note, setNote] = useState();
  console.log(note);

  let timer;

  let text = x => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      setNote(x);
    }, 1000);
  };

  return (
    <S>
      Note...
      <div
        contentEditable="true"
        onInput={e => {
          text(e.currentTarget.textContent);
        }}
      />
    </S>
  );
};
