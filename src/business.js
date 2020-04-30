import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadReservations } from "./redux/actions";

import styled from "styled-components";

import { Reservations } from "./business/reservations";

import { FB, A } from "./firebase";

import { setuid } from "./redux/actions";

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

    button {
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
      width: 120px;
      height: auto;
      top: 80px;
      right: 20px;
      border-radius: 5px;
      button {
        margin: 20px auto;
        display: block;
      }
    }
  }
`;

export const Business = ({ setUser, username }) => {

  const dispatch = useDispatch();

  const uid = useSelector(s => s.app.uid);

  useEffect(() => {
    if (uid) {
      let detach = FB.firestore()
        .collection("business")
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

      return () => detach();
    }
  }, [uid]);

  const [topshelf, setTopshelf] = useState(false);

  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_500/v1587884625/reserve/${username}.png`;

  return (
    <S>
      {topshelf && (
        <div className="top-shelf">
          {
            <button
              className="logout-button"
              onClick={() => {
                setTopshelf(false);
                setUser(false);
                if (username !== "guest") {
                  dispatch(setuid(null));
                  A.logout();
                }
              }}
            >
              logout
            </button>
          }
          {/* <button className="settings-button" onClick={() => {}}>
            settings
          </button> */}
        </div>
      )}

      <div className="topbar">
        <img
          alt="logo"
          src={logo}
          className="logo"
          onClick={() => {
            setTopshelf(!topshelf);
          }}
        />
        <div className="business-name">{username}</div>
      </div>

      <Reservations />
    </S>
  );
};
