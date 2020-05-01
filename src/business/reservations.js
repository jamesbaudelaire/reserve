import React, { useState } from "react";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { useSelector, useDispatch } from "react-redux";

import { ReservationForm } from "./reservation-form";

import { arrived } from "../redux/actions";

import { DB } from "../firebase";

const S = styled.div`
  .reservation {
    margin: 5px;
    transition: 0.3s;
    display: inline-block;
    border-radius: 5px;
    font-size: 15px;
    padding: 5px 10px;
    i {
      font-size: 25px;
      vertical-align: middle;
    }
    &:hover {
      .edit-reservation {
        opacity: 1;
      }
    }
  }

  .confirmed-total {
    color: var(--theme);
  }

  .confirmed-reservation {
    color: var(--theme);
  }

  .info {
    display: inline-block;
    &.arrived {
      text-decoration: line-through;
    }
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

  .edit-reservation {
    opacity: 0;
    transition: 0.3s;
  }
  .selected-reservation {
    background: var(--select);
    color: white;
    i {
      opacity: 1;
    }
  }

  .calendar {
    margin: 20px auto;
    display: block;
    width: min-content;
  }

  .time-slot {
    font-size: 20px;
    span {
      margin-left: 10px;
      i {
        font-size: 25px;
      }
    }
  }

  .reservations {
    max-width: 300px;
  }

  .today {
    font-size: 25px;
    text-transform: uppercase;
    i {
      margin: 10px;
      font-size: 30px;
    }
  }

  .notes {
    padding: 0px 10px;
  }
  .reservations-ui {
    margin: 0 40px;
  }

  .add-reservation {
    font-size: 30px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    margin: 20px;
    background: black;
    color: white;
    padding: 5px;
    transition: 0.3s;
    border-radius: 50%;
    z-index: 100;
    &:hover {
      background: var(--select);
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
      top: 0;
      margin: 20px;
    }
    .reservations-ui {
      position: absolute;
      left: 30px;
      top: 10px;
      margin: 0px;
      height: calc(100% - 40px);
    }

    .time-slots {
      height: calc(100% - 40px);
      overflow: scroll;
      margin: 10px;
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

export const Reservations = () => {
  const [day, setDay] = useState();
  const reservationsData = useSelector(s => s.reservations);

  let reservations = reservationsData;

  if (reservations && day) {
    reservations = reservations.filter(r =>
      ["year", "month", "number"].every(x => r.date[x] === day[x])
    );

    // let hour = new Date().getHours();
    // reservations = reservations.filter(r => r.time.hour >= hour);
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

  const uid = useSelector(s => s.app.uid);

  let addFBReservation = r => {
    if (uid) {
      DB.add(uid, r);
    }
  };

  let arrivedFB = (id, toggle) => {
    if (uid) {
      DB.arrived(uid, id, toggle);
    }
  };

  const dispatch = useDispatch();

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
          selectReservation={selectReservation}
          addFBReservation={addFBReservation}
        />
      )}

      {<CalendarUI day={day} setDay={setDay} />}

      <div className="reservations-ui">
        <div className="today">
          {day && day.name}

          <span className="confirmed-total">
            <i className="material-icons-round">people</i>
            <span className="number">{getNumbers("confirmed")}</span>
          </span>

          <span className="total">
            <i className="material-icons-round">people</i>
            <span className="number">{getNumbers()}</span>
          </span>
        </div>

        <div className="time-slots">
          {hours.map(h => (
            <div key={h}>
              <div className="time-slot">
                <span className="time">{`${getHour(h)}${getHourType(h)}`}</span>

                <span className="confirmed-total">
                  <i className="material-icons-round">people</i>
                  <span className="number">
                    {getConfirmedTotal(minutes(h))}
                  </span>
                </span>

                <span className="total">
                  <i className="material-icons-round">people</i>
                  <span className="number">{getTotal(minutes(h))}</span>
                </span>
              </div>
              <div className="reservations">
                {minutes(h).map(r => (
                  <div
                    className={`reservation ${
                      r.confirmed ? "confirmed-reservation" : ""
                    }`}
                    key={r.id}
                    id={r.id}
                  >
                    <i
                      className="material-icons-round arrived-toggle"
                      onClick={() => {
                        dispatch(arrived(r.id));
                        arrivedFB(r.id, !r.arrived);
                      }}
                    >
                      {r.arrived ? "check_box" : "check_box_outline_blank"}
                    </i>

                    <div className={`info ${r.arrived ? "arrived" : ""}`}>
                      <span className="time">{`${getHour(h)}:${getMinutes(
                        r.time.minutes
                      )}`}</span>
                      <span className="name">{r.name}</span>
                      <span className="people">{r.people}</span>
                    </div>

                    <i
                      className="material-icons-round edit-reservation"
                      onClick={() => {
                        setReservation(reservations.find(x => x.id == r.id));
                        setAddReservationUI(true);
                      }}
                    >
                      edit
                    </i>

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
        </div>
      </div>
    </S>
  );
};
