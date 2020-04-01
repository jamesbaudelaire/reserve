import React from "react";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { data } from "./data";

const S = styled.div`
  .logo {
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 0;
    margin: 20px;
  }

  .hour {
    font-size: 20px;
    font-weight: bold;
  }

  .reservation {
    background: grey;
    margin: 10px;
  }

  .confirmed-total {
    color: green;
  }

  .name {
    margin: 10px;
  }
`;

let getHour = h => {
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

  x.forEach(r => (n += r.number));

  return n;
};

let getConfirmedTotal = x => {
  let n = 0;

  x.forEach(r => {
    if (r.confirmed) {
      n += r.number;
    }
  });

  return n;
};

let selectedDay = {
  year: 2020,
  month: "mar",
  number: 1,
  name: "mon"
};

export const Business = () => {
  let { business } = useParams();

  let url = `https://randomuser.me/api/portraits/men/75.jpg`;

  let reservations =
    data[business].year[selectedDay.year][selectedDay.month][
      selectedDay.number
    ];

  let hours = [...new Set(reservations.map(r => r.time.hour))].sort((a, b) =>
    a > b ? 1 : -1
  );

  let minutes = h => {
    return reservations
      .filter(r => r.time.hour === h)
      .sort((a, b) => (a.time.minutes > b.time.minutes ? 1 : -1));
  };

  return (
    <S>
      {business}

      {<CalendarUI />}

      <div className="today">
        <div className="day">{selectedDay.name}</div>
        <div className="month">{selectedDay.month}</div>
        <div className="number">{selectedDay.number}</div>
      </div>

      <img alt="logo" src={url} className="logo" />

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
            <div className="reservation" key={r.id}>
              <span className="minutes">{`${getHour(h)}:${getMinutes(
                r.time.minutes
              )}`}</span>

              <span className="name">{r.name}</span>

              <span className="name">{r.number}</span>
            </div>
          ))}
        </div>
      ))}
    </S>
  );
};
