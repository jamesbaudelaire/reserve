import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Business } from "./business";

import { LS } from "./functions";
import { useDispatch } from "react-redux";
import { loadReservations } from "./redux/actions";

import { FB } from "./firebase";
import { setuid } from "./redux/actions";

import { Login } from "./login";

const S = styled.div`
  .app-name {
    font-size: 40px;
    margin: 20px;
  }

  .app-slogan {
    font-size: 20px;
    margin: 20px;
  }

  .guest-mode-button {
    margin: 20px;
    display: block;
  }
`;
export const Home = () => {
  const [user, setUser] = useState(false);
  const [username, setUsername] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    FB.auth().onAuthStateChanged(user => {
      if (user) {
        FB.firestore()
          .collection("business")
          .doc(user.uid)
          .get()
          .then(doc => {
            LS.guest = false;
            let data = doc.data();
            setUser(true);
            setUsername(data.name);
            dispatch(setuid(user.uid));
          });
      }
    });
  }, []);

  return (
    <S>
      {!user && (
        <>
          <div className="app-name">RSRV</div>
          <div className="app-slogan">Never lose a reservation again!</div>
          <button
            className="guest-mode-button"
            onClick={() => {
              setUsername("Guest");
              setUser(true);
              LS.init();
              dispatch(loadReservations(LS.data.reservations));
            }}
          >
            guest
          </button>
          <Login />
        </>
      )}

      {user && <Business setUser={setUser} username={username} />}
    </S>
  );
};
