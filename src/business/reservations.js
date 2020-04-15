import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { useSelector, useDispatch } from "react-redux";

import { ReservationForm } from "./reservation-form";

import { arrived } from "../redux/actions";

const S = styled.div`
  .reservation {
    background: grey;
    margin: 10px;
  }

  .confirmed-total {
    color: green;
  }
  .confirmed-reservation {
    background: green;
    color: white;
  }

  .name {
    margin: 10px;
  }

  .add-reservation {
    font-size: 30px;
  }
  .reservation-form {
    background: grey;
  }

  .edit-reservation {
    cursor: pointer;
  }
  .selected-reservation {
    border: 2px solid red;
  }
`;

let getHour = h => {
  if (h === 12 || h === 0) {
    return 12;
  }

  if (h < 12) {
    return `${h}`;
  } else {
    return `${h - 12}`;
  }
};

let getHourType = h => {
  if (h < 12) {
    return `am`;
  } else {
    return `pm`;
  }
};

let getMinutes = m => {
  if (m > 10) {
    return m;
  } else {
    return `0${m}`;
  }
};

let getTotal = x => {
  let n = 0;

  x.forEach(r => (n += r.people));

  return n;
};

let getConfirmedTotal = x => {
  let n = 0;

  x.forEach(r => {
    if (r.confirmed) {
      n += r.people;
    }
  });

  return n;
};

export const Reservations = () => {
  const day = useSelector(s => s.day);

  const reservationsData = useSelector(s => s.reservations);

  let reservations = reservationsData;

  if (reservations) {
    reservations = reservations.filter(r =>
      ["year", "month", "number"].every(x => r.date[x] === day[x])
    );
  }

  let hours = [...new Set(reservations.map(r => r.time.hour))].sort((a, b) =>
    a > b ? 1 : -1
  );

  let minutes = h => {
    return reservations
      .filter(r => r.time.hour === h)
      .sort((a, b) => (a.time.minutes > b.time.minutes ? 1 : -1));
  };

  const [addReservationUI, setAddReservationUI] = useState(false);
  const [reservation, setReservation] = useState(null);

  let selectReservation = id => {
    let x = document.querySelector(".selected-reservation");
    if (x) {
      x.classList.remove("selected-reservation");
    }
    if (id) {
      let el = document.getElementById(id);
      if (el) {
        el.classList.add("selected-reservation");
      }
    }
  };

  const dispatch = useDispatch();

  return (
    <S>
      {<CalendarUI />}

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
          setui={setAddReservationUI}
          ui={addReservationUI}
          reservation={reservation}
          setReservation={setReservation}
          selectReservation={selectReservation}
        />
      )}

      {hours.map(h => (
        <div key={h}>
          <span className="hour">{`${getHour(h)}${getHourType(h)}`}</span>

          <span className="total">
            <i className="material-icons-round">people</i>
            <span className="number">{getTotal(minutes(h))}</span>
          </span>

          <span className="confirmed-total">
            <i className="material-icons-round">people</i>
            <span className="number">{getConfirmedTotal(minutes(h))}</span>
          </span>

          {minutes(h).map(r => (
            <div
              className={`reservation ${r.confirmed &&
                "confirmed-reservation"}`}
              key={r.id}
              id={r.id}
            >
              <i
                className="material-icons-round arrived"
                onClick={() => {
                  dispatch(arrived(r.id));
                }}
              >
                {console.log(r.arrived)}
                {r.arrived ? "check_box" : "check_box_outline_blank"}
              </i>

              <span className="minutes">{`${getHour(h)}:${getMinutes(
                r.time.minutes
              )}`}</span>

              <span className="name">{r.name}</span>
              <span className="name">{r.people}</span>
              <i
                className="material-icons-round edit-reservation"
                onClick={() => {
                  setReservation(reservations.find(x => x.id == r.id));
                  setAddReservationUI(true);
                }}
              >
                edit
              </i>
            </div>
          ))}
        </div>
      ))}
    </S>
  );
};
