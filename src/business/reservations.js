import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { useSelector, useDispatch } from "react-redux";

import { ReservationForm } from "./reservation-form";

import { arrived } from "../redux/actions";

const S = styled.div`
  .reservation {
    background: grey;
    transition: 0.3s;
    margin: 10px;
    display: inline-block;
    border-radius: 30px;
    box-sizing: border-box;
    font-size: 15px;
    padding: 0px 10px 0 10px;
    i {
      font-size: 25px;
      vertical-align: middle;
    }
  }

  .confirmed-total {
    color: var(--theme);
  }
  .confirmed-reservation {
    background: var(--theme);
    color: white;
  }

  .info {
    display: inline-block;
    &.arrived {
      text-decoration: line-through;
    }
    .name,
    .time,
    .people {
      margin: 10px 5px;
      display: inline-flex;
    }
    .name {
      max-width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-transform: uppercase;
    }
  }

  .edit-reservation {
    cursor: pointer;
  }
  .selected-reservation {
    opacity: 0.5;
  }

  .calendar {
    margin: auto;
    display: block;
    width: min-content;
  }

  .time-slot {
    margin: 0 20px;
    font-size: 20px;
    span {
      margin-left: 10px;
      i {
        font-size: 30px;
      }
    }
  }

  .reservations {
    margin: 0 40px;
    max-width: 300px;
  }

  .today {
    font-size: 25px;
    margin: 20px;
    text-transform: uppercase;
    i {
      margin: 10px;
      font-size: 30px;
    }
  }

  .notes {
    margin: 5px 10px;
    display: inline-block;
    position: relative;
    span {
      display: none;
      position: absolute;
      top: -1px;
      left: 0;
      padding: 5px 10px;
      border-radius: 20px;
      background: black;
    }
    &:hover {
      span {
        display: block;
      }
    }
  }

  .reservations-ui {
    margin-bottom: 20px;
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

    let hour = new Date().getHours();
    reservations = reservations.filter(r => r.time.hour > hour);
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

  // useEffect(() => {
  //   if (addReservationUI) {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // }, [addReservationUI]);

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
      <div className="reservations-ui">
        <div className="today">
          {day && day.name}

          <span className="total">
            <i className="material-icons-round">people</i>
            <span className="number">{getNumbers()}</span>
          </span>

          <span className="confirmed-total">
            <i className="material-icons-round">people</i>
            <span className="number">{getNumbers("confirmed")}</span>
          </span>
        </div>

        <div className="time-slots">
          {hours.map(h => (
            <div key={h}>
              <div className="time-slot">
                <span className="time">{`${getHour(h)}${getHourType(h)}`}</span>

                <span className="total">
                  <i className="material-icons-round">people</i>
                  <span className="number">{getTotal(minutes(h))}</span>
                </span>

                <span className="confirmed-total">
                  <i className="material-icons-round">people</i>
                  <span className="number">
                    {getConfirmedTotal(minutes(h))}
                  </span>
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
                      className="material-icons-round arrived"
                      onClick={() => {
                        dispatch(arrived(r.id));
                      }}
                    >
                      {r.arrived ? "check_box" : "check_box_outline_blank"}
                    </i>

                    {r.notes && (
                      <div className="notes">
                        <i className="material-icons-round">error</i>
                        <span>{r.notes}</span>
                      </div>
                    )}

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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

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
        />
      )}

      {<CalendarUI day={day} setDay={setDay} />}
    </S>
  );
};
