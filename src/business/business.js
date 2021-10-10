import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadReservations } from "../redux/actions";

import styled from "styled-components";

import { Reservations } from "./reservations";

import { Unconfirmed } from "./unconfirmed";

import { FB, DB, AUTH } from "../x/firebase";

import { setuid } from "../redux/actions";

import { useAnimation } from "../x/animation";

import { Note } from "./note";

import { ReservationForm } from "./reservation-form";

import { Calendar, CalendarUI } from "../x/calendar";
import { getEmails } from "../analytics/functions";
import { Link } from "react-router-dom";

import { Settings } from "./settings";

let cal = new Calendar();

const S = styled.div`
  /* .topbar {
    display: flex;
    position: relative;
    flex-flow: row-reverse;
  } */

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    margin: 20px;
    box-shadow: var(--shadow);
  }

  .top-shelf {
    opacity: 0;
    transition: 0.3s;
    box-shadow: var(--shadow);
    position: fixed;
    z-index: 100;
    width: auto;
    height: auto;
    top: 60px;
    right: 20px;
    border-radius: 5px;

    button {
      margin: 20px;
      display: block;
    }

    &.loaded {
      opacity: 1;
      top: 80px;
      right: 20px;
    }
  }

  .selected {
    background: var(--green) !important;
    color: white !important;
  }

  .calendar {
    margin: 20px auto;
    margin-top: 40px;
    display: block;
    max-width: 300px;
  }

  .today {
    font-size: 20px;
    height: 50px;
    margin: 0 20px;
    text-transform: uppercase;
    i {
      margin: 10px;
      font-size: 30px;
    }
    .total-number {
      margin: 10px;
    }
  }

  .add-reservation {
    cursor: pointer;
    font-size: 40px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    margin: 20px;
    transition: 0.3s;
    border-radius: 5px;
    z-index: 100;
  }

  @media screen and (min-width: 1000px) {
    .topbar {
      position: fixed;
      top: 0;
      right: 0;
    }

    .today {
      position: fixed;
      left: 0;
      top: 0px;
      width: 160px;
    }

    .calendar {
      position: absolute;
      right: 0;
      top: 0px;
      margin-top: 20px;
      transform: scale(0.8);
      transform-origin: 220px 0px;
      max-width: 300px;
    }
  }
`;

let timeStamp = (day) => {
  return new Date(day).getTime();
};

export const Business = ({ setBusiness, url, username }) => {
  const [day, setDay] = useState(null);
  const [unconfirmed, setUnconfirmed] = useState([]);
  const [unconfirmedGR, setUnconfirmedGR] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [addReservationUI, setAddReservationUI] = useState(false);
  const [reservations, setReservations] = useState([]);
  // const [settings, setSettings] = useState(false);

  const dispatch = useDispatch();

  const uid = useSelector((s) => s.app.uid);

  useEffect(() => {
    if (uid && day) {
      let detach = FB.firestore()
        .collection("business")
        .doc(uid)
        .collection("reservations")
        .where(
          "timestamp",
          "==",
          timeStamp(`${day.month + 1}/${day.day}/${day.year}`)
        )
        .onSnapshot((q) => {
          let res = [];
          q.forEach((d) => {
            let r = d.data();
            res.push(r);
          });
          dispatch(loadReservations(res));
        });

      return () => detach();
    }
  }, [uid, day]);

  useEffect(() => {
    if (uid) {
      let detach = FB.firestore()
        .collection("private")
        .doc(url)
        .collection("reservations")
        .where("timestamp", ">=", cal.timeStamp())
        .onSnapshot((q) => {
          let res = [];
          q.forEach((d) => {
            let r = d.data();
            res.push(r);
          });
          setUnconfirmedGR(res);
        });

      return () => detach();
    }
  }, [uid]);

  useEffect(() => {
    if (uid && day) {
      let detach = FB.firestore()
        .collection("business")
        .doc(uid)
        .collection("reservations")
        .where("confirmed", "==", false)
        .where("timestamp", ">=", cal.timeStamp())
        .onSnapshot((q) => {
          let res = [];
          q.forEach((d) => {
            let r = d.data();
            res.push(r);
          });
          setUnconfirmed(res);
        });

      return () => detach();
    }
  }, [uid, day]);

  const [topshelf, setTopshelf] = useState(false);

  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_100/v1587884625/reserve/${username}`;

  const load = useAnimation();

  const state = useSelector((s) => s);

  let getDayName = (day) => {
    let string = `${day.month + 1}/${day.day}/${day.year}`;
    var date = new Date(string);
    return date.toLocaleDateString("locale", { weekday: "short" });
  };

  let getTotal = () => {
    let n = 0;

    reservations.forEach((r) => {
      n += r.people;
    });

    return n;
  };

  let getNumbers = (status) => {
    let n = 0;
    reservations.forEach((r) => (n += r.people));

    if (status === "confirmed") {
      n = 0;
      reservations.forEach((r) => {
        if (r.confirmed) {
          n += r.people;
        }
      });
    }
    return n;
  };

  let addFBReservation = (r) => {
    if (uid) {
      DB.add(uid, r);
    }
  };

  let deleteFBReservation = (r) => {
    if (uid) {
      DB.delete(uid, r);
    }
  };

  return (
    <S>
      {topshelf && (
        <div className="top-shelf" {...load}>
          {
            <button
              className="logout-button"
              onClick={() => {
                setTopshelf(false);
                setBusiness(false);
                if (uid) {
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
              getEmails(uid, state.reservations);
            }}
          >
            email list
          </button> */}
          {/* {uid && (
            <button
              className={`${settings ? "selected" : ""}`}
              onClick={() => {
                setSettings(!settings);
              }}
            >
              settings
            </button>
          )}
          {settings && <div id="settings">{uid && <Settings url={url} />}</div>} */}
        </div>
      )}

      <div className="topbar">
        <img
          alt="logo"
          src={logo}
          className="logo"
          onClick={() => {
            window.scrollTo(0, 0);
            setTopshelf(!topshelf);
          }}
        />
      </div>

      <div className="today">
        {day && getDayName(day)}

        <span className="confirmed-total">
          <i className="material-icons-round">people</i>
          <span className="number">
            {getNumbers("confirmed")} / {getTotal()}
          </span>
        </span>
      </div>

      <CalendarUI day={day} setDay={setDay} />

      <Note uid={uid} day={day} />

      <Unconfirmed
        setDay={setDay}
        reservation={reservation}
        setReservation={setReservation}
        unconfirmed={unconfirmed}
        setUnconfirmed={setUnconfirmed}
        setAddReservationUI={setAddReservationUI}
        unconfirmedGR={unconfirmedGR}
      />

      <Reservations
        day={day}
        setDay={setDay}
        reservation={reservation}
        setReservation={setReservation}
        reservations={reservations}
        setReservations={setReservations}
        setAddReservationUI={setAddReservationUI}
        setUnconfirmed={setUnconfirmed}
        url={url}
      />

      {!addReservationUI ? (
        <i
          className="material-icons-round add-reservation"
          onClick={() => {
            setAddReservationUI(true);
          }}
        >
          add
        </i>
      ) : (
        <ReservationForm
          day={day}
          setui={setAddReservationUI}
          ui={addReservationUI}
          reservation={reservation}
          setReservation={setReservation}
          addFBReservation={addFBReservation}
          deleteFBReservation={deleteFBReservation}
          url={url}
        />
      )}
    </S>
  );
};
