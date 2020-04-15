import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { addReservation } from "../redux/actions";

import { ID } from "./functions";

const S = styled.div`
  .reservation-form {
    background: grey;
  }

  .toggle {
    margin: 10px;
    label {
      margin-left: 10px;
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      input {
        opacity: 0;
        width: 0;
        height: 0;
        &:checked + span {
          background: blue;
        }
        &:checked + span:before {
          transform: translateX(20px);
        }
      }
      span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: grey;
        transition: 0.4s;
        border-radius: 20px;
        &:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: 2.5px;
          bottom: 2.5px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
      }
    }
  }

  textarea {
    resize: none;
  }
`;

let convertSingle = x => {
  if (x < 10) {
    return `0${x}`;
  } else {
    return x;
  }
};

export const ReservationForm = ({
  ui,
  setui,
  reservation,
  setReservation,
  selectReservation
}) => {
  const dispatch = useDispatch();

  const day = useSelector(s => s.day);

  let inputs = [
    {
      input: "name",
      type: "text"
    },
    {
      input: "people",
      type: "number"
    },
    {
      input: "email",
      type: "email"
    },
    {
      input: "phone",
      type: "text"
    },
    { input: "notes", type: "text" }
  ];

  useEffect(() => {
    if (reservation) {
      inputs.forEach(x => {
        document.getElementById(x.input).value = reservation[x.input];
      });

      document.getElementById("confirmed").checked = reservation.confirmed;
      document.getElementById("time").value = `${convertSingle(
        reservation.time.hour
      )}:${convertSingle(reservation.time.minutes)}`;

      selectReservation(reservation.id);
    }
  });

  let convertTime = x => {
    let time = {};

    time.hour = parseInt(x.substring(0, 2));

    time.minutes = parseInt(x.substring(3, 5));

    return time;
  };

  let newReservation = () => {
    let r = {};

    inputs.forEach(x => {
      r[x.input] = document.getElementById(x.input).value;
    });

    r.people = parseInt(r.people);

    r.date = {
      year: day.year,
      month: day.month,
      number: day.number
    };

    r.confirmed = document.getElementById("confirmed").checked;

    if (reservation) {
      r.id = reservation.id;
    } else {
      r.id = ID();
    }

    r.time = convertTime(document.getElementById("time").value);

    return r;
  };

  let resetui = () => {
    setui(false);
    setReservation(null);
    selectReservation();
  };

  return (
    <S>
      <div className="inputs">
        {inputs.map(x => (
          <input
            id={x.input}
            key={x.input}
            placeholder={x.input}
            type={x.type}
          />
        ))}

        <div className="toggle">
          confirmed
          <label>
            <input type="checkbox" id="confirmed" />
            <span />
          </label>
        </div>

        <input type="time" id="time" />
      </div>

      <div className="reservation-form">
        <button
          onClick={() => {
            if (newReservation().people > 0) {
              dispatch(addReservation(newReservation()));
              resetui();
            }
          }}
        >
          save
        </button>
        <button
          onClick={() => {
            resetui();
          }}
        >
          cancel
        </button>
      </div>
    </S>
  );
};
