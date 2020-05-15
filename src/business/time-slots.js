import React, { useState, useEffect } from "react";

import styled from "styled-components";
import { IO } from "../x/IO";

const S = styled.div`
  margin: 20px 0;

  .reservations {
    max-width: 200px;
    margin-left: 50px;
  }

  .reservation {
    background: #3f3d56;
    color: white;
    margin: 5px 10px;
    position: relative;
    transition: 0.3s;
    display: inline-block;
    border-radius: 5px;
    font-size: 15px;
    cursor: pointer;
    width: fit-content;
    padding: 5px;
    i {
      font-size: 25px;
      vertical-align: middle;
    }
  }

  .confirmed-reservation {
    background: var(--theme);
  }

  .info {
    display: inline-block;
    .name,
    .time,
    .people {
      margin: 0px 5px;
      display: inline-flex;
    }
  }

  .notes {
    font-style: italic;
  }

  .selected-reservation {
    background: var(--select);
    box-shadow: var(--shadow);
    color: white;
  }

  .time-slot {
    font-size: 20px;
    span {
      margin-left: 10px;
      i {
        font-size: 25px;
      }
    }
    margin-left: 20px;
    transition: 0.3s;
    opacity: 0;
    transform: translatex(20px);
    &.io {
      opacity: 1;
      transform: translatex(0px);
    }
  }

  .loading-reservations {
    position: fixed;
    margin: 20px;
    bottom: 0;
    left: 0;
    top: unset;
  }

  @media screen and (max-width: 1000px) {
    white-space: nowrap;
    overflow: scroll;

    .reservations {
      display: grid;
    }

    .time-slot {
      display: inline-block;
    }
    .time-slot:last-child {
      margin-right: 20px;
    }
  }

  @media screen and (min-width: 1000px) {
    position: absolute;
    left: 0px;
    width: 300px;
    top: 0px;
    margin: 0px;
    height: 100%;
    overflow: scroll;
    .time-slot {
      margin: 20px;
    }
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
    return `AM`;
  } else {
    return `PM`;
  }
};

let getMinutes = m => {
  if (m > 9) {
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

export const TimeSlots = ({
  loading,
  reservations,
  setReservation,
  setAddReservationUI
}) => {
  let hours = [...new Set(reservations.map(r => r.time.hour))].sort((a, b) =>
    a > b ? 1 : -1
  );

  let minutes = h => {
    return reservations
      .filter(r => r.time.hour === h)
      .sort((a, b) => (a.time.minutes > b.time.minutes ? 1 : -1));
  };

  useEffect(() => {
    let targets = document.querySelectorAll(".time-slot");
    targets.forEach((x, i) => {
      setTimeout(() => {
        IO(x);
      }, i * 50);
    });
  });

  return (
    <S>
      {hours.map(h => (
        <div className="time-slot" key={h}>
          <span className="time">{`${getHour(h)}${getHourType(h)}`}</span>

          <span className="confirmed-total">
            <i className="material-icons-round">people</i>
            <span className="number">{getConfirmedTotal(minutes(h))}</span>
          </span>

          <span className="total">
            <i className="material-icons-round">people</i>
            <span className="number">{getTotal(minutes(h))}</span>
          </span>

          <div className="reservations">
            {minutes(h).map(r => (
              <div
                className={`reservation ${
                  r.confirmed ? "confirmed-reservation" : ""
                }`}
                onClick={() => {
                  setReservation(reservations.find(x => x.id == r.id));
                  setAddReservationUI(true);
                }}
                key={r.id}
                id={r.id}
              >
                <div className="info">
                  <span className="name">{r.name}</span>
                  <span className="people">{r.people}</span>
                  <span className="time">{`${getHour(h)}:${getMinutes(
                    r.time.minutes
                  )}`}</span>
                </div>

                {r.notes && (
                  <div className="notes">
                    <span>{r.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && reservations.length === 0 && (
        <div className="no-reservations">No reservations today!</div>
      )}

      {loading && (
        <svg className="loader loading-reservations">
          <circle cx="25" cy="25" r="15" />
        </svg>
      )}
    </S>
  );
};