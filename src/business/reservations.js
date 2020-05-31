import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { useSelector } from "react-redux";

import { TimeSlots } from "./time-slots";

import { LS } from "../x/functions";

import { IO } from "../x/IO";

import { useAnimation } from "../x/animation";

import { ReactComponent as None } from "../assets/no-reservations.svg";

import { Calendar } from "../x/calendar";
let cal = new Calendar();

const S = styled.div`
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

  @media screen and (min-width: 1000px) {
    .no-reservations {
      margin: 30px;
    }
    .svg-none {
      position: absolute;
      bottom: 10px;
      left: 0px;
      height: 160px;
      width: 320px;
      z-index: -10;
    }
  }
`;

let timeStamp = day => {
  return new Date(day).getTime();
};

export const Reservations = ({
  day,
  reservation,
  reservations,
  setReservations,
  setReservation,
  setAddReservationUI,
  setUnconfirmed
}) => {
  const [loading, setLoading] = useState();

  const reservationsData = useSelector(s => s.reservations);

  useEffect(() => {
    setLoading(true);
    if (LS.guest) {
      setUnconfirmed(
        reservationsData
          .filter(r => !r.confirmed)
          .filter(r => {
            if (r.timestamp >= cal.timeStamp()) {
              return r;
            }
          })
      );

      if (reservationsData && day) {
        let reservations = reservationsData.filter(
          r =>
            r.timestamp == timeStamp(`${day.month + 1}/${day.day}/${day.year}`)
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
        <div className="loading-line">
          <div />
        </div>
      )}
    </S>
  );
};
