import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Business } from "./business/business";

import { LS } from "./x/functions";
import { useDispatch } from "react-redux";
import { loadReservations } from "./redux/actions";

import { FB } from "./x/firebase";
import { setuid } from "./redux/actions";

import { Login } from "./x/login";

import { ReactComponent as Rsrv } from "./files/rsrv.svg";

const S = styled.div`
  .app-name {
    font-size: 40px;
    margin: 10px 20px;
    color: var(--theme);
  }

  .app-slogan {
    font-size: 20px;
    margin: 0px 40px;
  }

  .guest-mode-button {
    margin: 20px auto;
    display: block;
  }

  .rsrv {
    svg {
      width: calc(100% - 40px);
      height: 300px;
      margin: auto 20px;
    }
  }

  @media screen and (min-width: 1000px) {
    .guest-mode-button {
      position: absolute;
      top: 0;
      right: 0;
      margin: 20px;
    }

    .rsrv {
      svg {
        margin-top: 40px;
      }
    }
  }
`;
export const Home = () => {
  const [user, setUser] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    FB.auth().onAuthStateChanged(user => {
      if (user) {
        setLoading(true);
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
            setLoading(false);
          });
      }
    });
  }, []);

  return (
    <S>
      {loading && (
        <svg className="loader">
          <circle cx="25" cy="25" r="15" />
        </svg>
      )}

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
            try now
          </button>
          <div className="rsrv">
            <Rsrv />
          </div>

          <Login setLoading={setLoading} />
        </>
      )}

      {user && <Business setUser={setUser} username={username} />}
    </S>
  );
};
