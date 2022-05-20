import React from "react";
import { AUTH } from "./firebase";

import styled from "styled-components";

const S = styled.div`
  margin: 0px auto;
  text-align: center;

  input {
    margin: 0;
    margin-bottom: 10px;
  }

  button {
    margin: 0 10px;
  }

  @media screen and (max-width: 1000px) {
    max-width: 300px;
  }

  @media screen and (min-width: 1000px) {
    input {
      margin: 20px;
    }
  }
`;

export const Login = ({ setLoading }) => {
  let inputs = [
    {
      input: "email",
      type: "email"
    },
    {
      input: "password",
      type: "password"
    }
  ];

  let getInputs = () => {
    let login = {};
    inputs.forEach((x) => {
      login[x.input] = document.getElementById(x.input).value;
    });

    AUTH.signInWithEmailAndPassword(login.email, login.password).catch(
      (error) => {
        setLoading(false);
        alert(error.message);
      }
    );
  };
  return (
    <S>
      <div className="inputs">
        {inputs.map((x) => (
          <input
            id={x.input}
            key={x.input}
            placeholder={x.input}
            type={x.type}
          />
        ))}
      </div>
      <button
        className="login-button"
        onClick={() => {
          setLoading(true);

          getInputs();
        }}
      >
        login
      </button>
      <a href="mailto:ronakmystery@gmail.com">
        <button className="email">sign up</button>
      </a>
    </S>
  );
};
