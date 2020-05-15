import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { CalendarUI } from "../x/calendar";

import { useSelector, useDispatch } from "react-redux";

import { ReservationForm } from "./reservation-form";

import { TimeSlots } from "./time-slots";

import { DB } from "../x/firebase";

import { LS } from "../x/functions";

import { IO } from "../x/IO";

const S = styled.div`
  .confirmed-total {
    color: var(--theme);
  }

  .calendar {
    margin: 0px auto;
    display: block;
    width: min-content;
  }

  .today {
    font-size: 25px;
    margin: 0 20px;
    text-transform: uppercase;
    i {
      margin: 10px;
      font-size: 30px;
    }
  }

  .add-reservation {
    cursor: pointer;
    font-size: 40px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    margin: 20px;
    color: white;
    transition: 0.3s;
    background: #3f3d56;
    border-radius: 5px;
    z-index: 100;
  }

  .no-reservations {
    margin: 0 20px;
  }

  .unconfirmed-reservations {
    margin: 20px 0;
    div {
      overflow: auto;
      white-space: nowrap;
      .unconfirmed-reservation {
        margin: 0;
        margin-left: 20px;
        transition: 0.3s;
        opacity: 0;
        transform: translatex(20px);
        &.io {
          opacity: 1;
          transform: translatex(0px);
        }
      }
    }
    span {
      display: block;
      margin: 0 0 10px 20px;
    }
  }

  @media screen and (max-width: 1000px) {
    .unconfirmed-reservations {
      button {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }

  @media screen and (min-width: 1000px) {
    .add-reservation {
      top: 0;
      left: 0;
      right: unset;
      bottom: unset;
    }
    .calendar {
      position: absolute;
      right: 0;
      top: 40px;
      margin: 20px;
    }

    .today {
      position: absolute;
      right: 0;
      top: 0px;
    }
    .no-reservations {
      margin: 20px;
    }
    .unconfirmed-reservations {
      position: fixed;
      right: 25px;
      top: 80px;
      box-shadow: var(--shadow);
      border-radius: 5px;

      div {
        display: grid;
        max-height: 50vh;
        .unconfirmed-reservation {
          margin: 10px;
          margin-top: 0;
        }
      }
      span {
        margin: 10px;
      }
    }
  }
`;

let getDayName = day => {
  let string = `${day.month + 1}/${day.day}/${day.year}`;
  var date = new Date(string);
  return date.toLocaleDateString("locale", { weekday: "short" });
};

export const Reservations = ({ day, setDay, unconfirmed, setUnconfirmed }) => {
  const [loading, setLoading] = useState();

  const [reservations, setReservations] = useState([]);

  const reservationsData = useSelector(s => s.reservations);

  useEffect(() => {
    setLoading(true);
    if (LS.guest) {
      setUnconfirmed(reservationsData.filter(r => !r.confirmed));

      if (reservationsData && day) {
        let reservations = reservationsData.filter(r =>
          ["year", "month", "day"].every(x => r.date[x] === day[x])
        );
        setReservations(reservations);
      }
    } else {
      setReservations(reservationsData);
    }
  }, [day, reservationsData]);

  useEffect(() => {
    setLoading(false);
  }, [reservations]);

  const [addReservationUI, setAddReservationUI] = useState(false);
  const [reservation, setReservation] = useState(null);
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

  const uid = useSelector(s => s.app.uid);

  let addFBReservation = r => {
    if (uid) {
      DB.add(uid, r);
    }
  };

  let deleteFBReservation = r => {
    if (uid) {
      DB.delete(uid, r);
    }
  };

  useEffect(() => {
    let targets = document.querySelectorAll(".unconfirmed-reservation");
    targets.forEach((x, i) => {
      setTimeout(() => {
        IO(x);
      }, i * 50);
    });
  });

  return (
    <S>
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
        />
      )}

      <div className="today">
        {day && getDayName(day)}

        <span className="confirmed-total">
          <i className="material-icons-round">people</i>
          <span className="number">{getNumbers("confirmed")}</span>
        </span>

        <span className="total">
          <i className="material-icons-round">people</i>
          <span className="number">{getNumbers()}</span>
        </span>
      </div>

      {unconfirmed.length > 0 && (
        <div className="unconfirmed-reservations">
          <span>{unconfirmed.length} UNCONFIRMED</span>
          <div>
            {unconfirmed.map(r => (
              <button
                className="unconfirmed-reservation"
                key={r.id}
                onClick={() => {
                  setDay(r.date);
                  setReservation(r);
                  setAddReservationUI(true);
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {<CalendarUI day={day} setDay={setDay} />}

      <TimeSlots
        loading={loading}
        reservations={reservations}
        setAddReservationUI={setAddReservationUI}
        setReservation={setReservation}
      />
    </S>
  );
};
