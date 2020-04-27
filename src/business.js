import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { Reservations } from "./business/reservations";

import { LS } from "./functions";
import { loadReservations } from "./redux/actions";

import { FB, A } from "./firebase";

import { uid } from "./redux/actions";
import { Login } from "./login";

const S = styled.div`
  .topbar {
    display: flex;
    align-items: center;
    position: relative;
    flex-flow: row-reverse;
  }
  .business-name {
    font-size: 30px;
  }

  .logo {
    cursor: pointer;
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    top: 0;
    left: 0;
    margin: 20px;
    box-shadow: var(--shadow);
  }

  .top-shelf {
    background: rgb(200, 200, 200);

    right: 0;
    top: 0;
    width: 100%;
    height: 70px;
    z-index: 100;

    .logout {
      margin: 20px;
    }
  }

  @media screen and (min-width: 1000px) {
    .topbar {
      position: fixed;
      top: 0;
      right: 0;
    }
    .top-shelf {
      box-shadow: var(--shadow);
      position: fixed;
      z-index: 100;
      width: fit-content;
      height: 300px;
      top: 80px;
      right: 20px;
      border-radius: 5px;
    }
  }
`;

export const Business = () => {
  let { url } = useParams();

  const [name, setName] = useState();

  const dispatch = useDispatch();

  const [user, setUser] = useState(false);

  const [topshelf, setTopshelf] = useState(false);

  let ref = FB.firestore().collection("business");

  useEffect(() => {
    if (url === "guest") {
      LS.init();
      dispatch(loadReservations(LS.data.reservations));
      setUser(true);
      setName("Guest");
    } else {
      FB.auth().onAuthStateChanged(user => {
        if (user) {
          ref
            .doc(user.uid)
            .get()
            .then(doc => {
              let data = doc.data();
              if (url === data.url) {
                setUser(true);
                setName(data.name);
                dispatch(uid(user.uid));
                loadFBReservations(user.uid);
              }
            });
        }
      });
    }
  }, []);

  let loadFBReservations = uid => {
    ref
      .doc(uid)
      .collection("reservations")
      .onSnapshot(q => {
        let res = [];

        q.forEach(d => {
          let r = d.data();
          res.push(r);
        });

        dispatch(loadReservations(res));
      });
  };

  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_500/v1587884625/reserve/${url}.png`;

  return (
    <S>
      {topshelf && (
        <div className="top-shelf">
          {
            <button
              className="logout"
              onClick={() => {
                setTopshelf(false);
                if (url !== "guest") {
                  A.logout();
                  setUser(false);
                }
              }}
            >
              logout
            </button>
          }
        </div>
      )}

      {user ? (
        <>
          <div className="topbar">
            <img
              alt="logo"
              src={logo}
              className="logo"
              onClick={() => {
                setTopshelf(!topshelf);
              }}
            />
            <div className="business-name">{name}</div>
          </div>
          <Reservations />
        </>
      ) : (
        <Login />
      )}
    </S>
  );
};
