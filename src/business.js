import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadReservations } from "./redux/actions";

import styled from "styled-components";

import { Reservations } from "./business/reservations";

import { FB, AUTH } from "./firebase";

import { setuid } from "./redux/actions";

import { useAnimation } from "./x/animation";

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
    border-radius: 5px;
    top: 0;
    left: 0;
    margin: 20px;
    box-shadow: var(--shadow);
  }

  .top-shelf {
    opacity: 0;
    transition: 0.3s;

    &.loaded {
      opacity: 1;
    }
    background: rgb(200, 200, 200);
    right: 0;
    top: 0;
    width: 100%;
    z-index: 100;

    button {
      margin: 20px;
      margin-right: 0;
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
  const [day, setDay] = useState();

  const dispatch = useDispatch();

  const uid = useSelector(s => s.app.uid);

  useEffect(() => {
    if (uid) {
      let detach = FB.firestore()
        .collection("business")
        .doc(uid)
        .collection("years")
        .doc(`${day.year}`)
        .collection(`${day.month}`)
        .doc(`${day.number}`)
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
  }, [uid, day]);

  const [topshelf, setTopshelf] = useState(false);

  // const state = useSelector(s => s);

  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_500/v1587884625/reserve/${username}.png`;

  const load = useAnimation();

  return (
    <S>
      {topshelf && (
        <div className="top-shelf" {...load}>
          {
            <button
              className="logout-button"
              onClick={() => {
                setTopshelf(false);
                setUser(false);
                if (username !== "Guest") {
                  dispatch(setuid(null));
                  AUTH.signOut();
                }
              }}
            >
              logout
            </button>
          }

          {/* <button
            onClick={() => {
              let emails = [
                ...new Set(
                  state.reservations.map(r => r.email).filter(r => r !== "")
                )
              ].join(", ");
              if (emails) {
                prompt("Remember to set BCC for email privacy!", emails);
              } else {
                alert("No emails found!");
              }
            }}
          >
            get emails
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

      <Reservations day={day} setDay={setDay} />
    </S>
  );
};
