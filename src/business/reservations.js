import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { useSelector, useDispatch } from "react-redux";

import { ReservationForm } from "./reservation-form";

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
`;

let getHour = h => {
if(h===12||h===0){
  return 12
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
  const dispatch = useDispatch();

  const data = useSelector(s => s.data);
  const day = useSelector(s => s.day);

  let reservations = [];
  if (data.reservations) {
    reservations = data.reservations.filter(r =>
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

  const [addReservationUI, setAddReservationUI] = useState(true);
  const [reservation, setReservation] = useState(null);

  return (
    <S>
      <div className="today">
        <div className="day">{day.name}</div>
        <div className="month">{day.month}</div>
        <div className="number">{day.number}</div>
      </div>

      {<CalendarUI />}

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
              onClick={() => {
                setReservation(reservations.find(x => x.id == r.id));
                setAddReservationUI(true);
              }}
            >
              <span className="minutes">{`${getHour(h)}:${getMinutes(
                r.time.minutes
              )}`}</span>

              <span className="name">{r.name}</span>
              <span className="name">{r.people}</span>
            </div>
          ))}
        </div>
      ))}

      <i
        className="material-icons-round add-reservation"
        onClick={() => {
          setAddReservationUI(true);
        }}
      >
        add
      </i>

      {addReservationUI && (
        <ReservationForm
          setui={setAddReservationUI}
          ui={addReservationUI}
          reservation={reservation}
          setReservation={setReservation}
        />
      )}
    </S>
  );
};
