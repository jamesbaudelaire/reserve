import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Business } from "./business/business";

import { LS } from "./x/functions";
import { useDispatch } from "react-redux";
import { loadReservations, loadNotes } from "./redux/actions";

import { FB } from "./x/firebase";
import { setuid } from "./redux/actions";

import { Login } from "./x/login";

import { ReactComponent as Rsrv } from "./assets/rsrv.svg";

import { notesLS } from "./x/notesLS";

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
    width: calc(100% - 40px);
    position: fixed;
    bottom: -220px;
    z-index: -10;
    margin: 20px;
  }

  @media screen and (min-width: 1000px) {
    .guest-mode-button {
      margin: 10px auto;
      display: block;
    }

    .rsrv {
      bottom: 0;
    }
  }
`;
export const Home = () => {
  const [url, setUrl] = useState();
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    FB.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoading(true);
        FB.firestore()
          .collection("business")
          .doc(user.uid)
          .get()
          .then((doc) => {
            LS.guest = false;
            let data = doc.data();
            setUrl(data.url);
            setUsername(data.name);
            dispatch(setuid(user.uid));
            setLoading(false);
            setBusiness(true);
          })
          .catch((error) => {
            if (error) {
              setLoading(false);
              alert("Error, try again later!");
            }
          });
      }
    });
  }, []);

  return (
    <S>
      <div className={`loading-line ${loading ? "loaded" : ""}`}>
        <div />
      </div>

      {!business && (
        <div id="landing">
          <div className="app-name">RSRV</div>

          <div className="app-slogan">Never lose a reservation again...</div>
          <button
            className="guest-mode-button"
            onClick={() => {
              setUsername("Guest");
              setBusiness(true);
              LS.init();
              notesLS.init();
              dispatch(loadReservations(LS.data.reservations));
              dispatch(loadNotes(notesLS.data));
            }}
          >
            try now
          </button>

          <Rsrv className="rsrv" />

          <Login setLoading={setLoading} />
        </div>
      )}

      {business && (
        <Business
          id="main"
          setBusiness={setBusiness}
          username={username}
          url={url}
        />
      )}
    </S>
  );
};
