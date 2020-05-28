import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadReservations } from "../redux/actions";

import styled from "styled-components";

import { Reservations } from "./reservations";

import { Unconfirmed } from "./unconfirmed";

import { FB, AUTH } from "../x/firebase";

import { setuid } from "../redux/actions";

import { useAnimation } from "../x/animation";

// import { Calendar } from "../x/calendar2";
import { Calendar, CalendarUI } from "../x/calendar";

let cal = new Calendar();

import { Note } from "./note";

const S = styled.div`
  .topbar {
    display: flex;
    position: relative;
    flex-flow: row-reverse;
  }
  .business-name {
    font-size: 30px;
    margin: 20px 0;
  }

  .logo {
    cursor: pointer;
    background-color: white;
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 5px;
    top: 0;
    left: 0;
    margin: 20px;
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

  .selected {
    background: var(--select) !important;
    color: white !important;
  }

  .calendar {
    margin: 20px auto;
    display: block;
    max-width: 300px;
  }

  .today {
    font-size: 25px;
    margin: 20px;
    margin-top: -40px;
    text-transform: uppercase;
    i {
      margin: 10px;
      font-size: 30px;
    }
    .confirmed-total {
      color: var(--theme);
    }
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
      top: 40px;
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

    .calendar {
      position: absolute;
      right: 0;
      top: 0px;
      margin: 20px;
      max-width: 300px;
    }
  }
`;

export const Business = ({ setBusiness, url, username }) => {
  const [day, setDay] = useState(null);
  const [unconfirmed, setUnconfirmed] = useState([]);
  const [unconfirmedGR, setUnconfirmedGR] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [addReservationUI, setAddReservationUI] = useState(false);
  const [reservations, setReservations] = useState([]);

  const dispatch = useDispatch();

  const uid = useSelector(s => s.app.uid);

  useEffect(() => {
    if (uid && day) {
      let detach = FB.firestore()
        .collection("business")
        .doc(uid)
        .collection("reservations")
        .where("date.year", "==", day.year)
        .where("date.month", "==", day.month)
        .where("date.day", "==", day.day)
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

  useEffect(() => {
    if (uid) {
      let detach = FB.firestore()
        .collection("private")
        .doc(url)
        .collection("reservations")
        .onSnapshot(q => {
          let res = [];
          q.forEach(d => {
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
        .where("date", ">=", cal.today())
        .onSnapshot(q => {
          let res = [];
          q.forEach(d => {
            let r = d.data();
            res.push(r);
          });
          setUnconfirmed(res);
        });

      return () => detach();
    }
  }, [uid, day]);

  const [topshelf, setTopshelf] = useState(false);

  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_100/v1587884625/reserve/${username}.png`;

  const load = useAnimation();

  const state = useSelector(s => s);
  let getEmails = () => {
    if (uid) {
      FB.firestore()
        .collection("business")
        .doc(uid)
        .collection("reservations")
        .where("email", ">", "")
        .get()
        .then(q => {
          let res = [];
          q.forEach(d => {
            let r = d.data();
            res.push(r.email);
          });

          let emails = [...new Set(res)].join(", ");

          if (emails) {
            prompt("Remember to set BCC for email privacy!", emails);
          } else {
            alert("No emails found!");
          }
        });
    } else {
      let emails = [
        ...new Set(state.reservations.map(r => r.email).filter(e => e !== ""))
      ].join(", ");

      if (emails) {
        prompt("Remember to set BCC for email privacy!", emails);
      } else {
        alert("No emails found!");
      }
    }
  };

  let getDayName = day => {
    let string = `${day.month + 1}/${day.day}/${day.year}`;
    var date = new Date(string);
    return date.toLocaleDateString("locale", { weekday: "short" });
  };

  let getNumbers = status => {
    let n = 0;
    reservations.forEach(r => (n += r.people));

    if (status === "confirmed") {
      n = 0;
      reservations.forEach(r => {
        if (r.confirmed) {
          n += r.people;
        }
      });
    }
    return n;
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

          <button
            onClick={() => {
              getEmails();
            }}
          >
            get emails
          </button>

          {/* <button
            onClick={() => {
              if (uid) {
                console.log("beta");
              } else {
                alert("Premium feature!");
              }
            }}
          >
            analytics
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

      <div className="today">
        {day && getDayName(day)}

        <span className="confirmed-total">
          <i className="material-icons-round">people</i>
          <span className="number">{getNumbers("confirmed")}</span>
        </span>
      </div>

      <Unconfirmed
        setDay={setDay}
        reservation={reservation}
        setReservation={setReservation}
        unconfirmed={unconfirmed}
        setUnconfirmed={setUnconfirmed}
        setAddReservationUI={setAddReservationUI}
        unconfirmedGR={unconfirmedGR}
      />

      {/* <Note uid={uid} /> */}

      {/* <Calendar day={day} setDay={setDay} /> */}
      <CalendarUI day={day} setDay={setDay} />

      <Reservations
        day={day}
        setDay={setDay}
        reservation={reservation}
        setReservation={setReservation}
        reservations={reservations}
        setReservations={setReservations}
        addReservationUI={addReservationUI}
        setAddReservationUI={setAddReservationUI}
        setUnconfirmed={setUnconfirmed}
        url={url}
      />
    </S>
  );
};
