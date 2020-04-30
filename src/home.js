import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Business } from "./business";

import { LS } from "./functions";
import { useDispatch } from "react-redux";
import { loadReservations } from "./redux/actions";

import { FB } from "./firebase";
import { setuid } from "./redux/actions";

import { Login } from "./login";

const S = styled.div``;
export const Home = () => {
  const [user, setUser] = useState(false);
  const [username, setUsername] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    FB.auth().onAuthStateChanged(user => {
      if (user) {
        let ref = FB.firestore().collection("business");

        ref
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
          <button
            onClick={() => {
              setUsername("guest");
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
