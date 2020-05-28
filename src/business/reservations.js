import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { useSelector } from "react-redux";

import { ReservationForm } from "./reservation-form";

import { TimeSlots } from "./time-slots";

import { DB } from "../x/firebase";

import { LS } from "../x/functions";

import { IO } from "../x/IO";

import { useAnimation } from "../x/animation";

import { ReactComponent as None } from "../assets/no-reservations.svg";

import { Calendar } from "../x/calendar";
let cal = new Calendar();

const S = styled.div`
  .add-reservation {
    cursor: pointer;
    font-size: 40px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    margin: 20px;
    transition: 0.3s;
    background: white;
    border-radius: 5px;
    z-index: 100;
  }

  .no-reservations {
    margin: 20px;
    opacity: 0;
    font-size: 20px;
    transition: 0.3s;
    &.loaded {
      opacity: 1;
    }
    display: inline-block;
  }

  .svg-none {
    height: 160px;
    margin: 0 20px;
    width: calc(100% - 40px);
    margin-top: 20px;
  }

  @media screen and (max-width: 1000px) {
    .loading-reservations {
      left: 0;
    }
  }

  @media screen and (min-width: 1000px) {
    .add-reservation {
      left: 0;
      right: unset;
    }

    .loading-reservations {
      top: unset;
      bottom: 0;
    }

    .no-reservations {
      margin: 30px;
    }
    .svg-none {
      position: absolute;
      bottom: 10px;
      left: 0px;
      height: 160px;
      width: 320px;
    }
  }
`;

export const Reservations = ({
  day,
  setDay,
  reservation,
  reservations,
  setReservations,
  setReservation,
  addReservationUI,
  setAddReservationUI,
  setUnconfirmed,
  url
}) => {
  const [loading, setLoading] = useState();

  const reservationsData = useSelector(s => s.reservations);

  useEffect(() => {
    setLoading(true);
    if (LS.guest) {
      setUnconfirmed(
        reservationsData
          .filter(r => !r.confirmed)
          .filter(r =>
            ["year", "month", "day"].every(x => r.date[x] >= cal.today()[x])
          )
      );

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

  let load = useAnimation();

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
          url={url}
        />
      )}

      {reservations.length > 0 && (
        <TimeSlots
          loading={loading}
          reservations={reservations}
          setAddReservationUI={setAddReservationUI}
          setReservation={setReservation}
          reservation={reservation}
        />
      )}

      {!loading && reservations.length === 0 && (
        <div className="no-reservations" {...load}>
          <span>No reservations...</span>
          <None className="svg-none" />
        </div>
      )}

      {!LS.guest && loading && (
        <svg className="loader loading-reservations">
          <circle cx="25" cy="25" r="15" />
        </svg>
      )}
    </S>
  );
};
