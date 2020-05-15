import React from "react";
import { AUTH } from "./firebase";

import styled from "styled-components";

const S = styled.div`
  .inputs {
    margin: 20px;
    text-align: center;
  }
  .login-button {
    display: block;
    margin: 10px auto;
  }

  @media screen and (min-width: 1000px) {
    .inputs {
      position: fixed;
      top: 0;
      left: 0;
    }
    .login-button {
      margin: 10px;
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
    inputs.forEach(x => {
      login[x.input] = document.getElementById(x.input).value;
    });

    AUTH.signInWithEmailAndPassword(login.email, login.password).catch(
      error => {
        setLoading(false);
        alert(error.message);
      }
    );
  };
  return (
    <S>
      <div className="inputs">
        {inputs.map(x => (
          <input
            id={x.input}
            key={x.input}
            placeholder={x.input}
            type={x.type}
          />
        ))}
        <button
          className="login-button"
          onClick={() => {
            setLoading(true);

            getInputs();
          }}
        >
          login
        </button>
      </div>
    </S>
  );
};
