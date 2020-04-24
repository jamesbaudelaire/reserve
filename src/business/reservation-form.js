import React, { useEffect } from "react";

import styled from "styled-components";

import { useDispatch } from "react-redux";
import { addReservation } from "../redux/actions";

import { ID } from "../functions";

const S = styled.div`
  .reservation-form {
    .buttons {
      text-align: right;
    }
  }

  .toggle {
    margin: 10px;
    line-height: 20px;
    vertical-align: middle;
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
          background: var(--theme);
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
        box-shadow: rgba(0, 0, 0, 0.75) 0px 2px 5px 0px inset;

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
          box-shadow: var(--shadow);
        }
      }
    }
  }

  textarea {
    resize: none;
  }

  .inputs {
    margin: 0 20px;
   
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
  day,
  setui,
  reservation,
  setReservation,
  selectReservation,
  addFBReservation
}) => {
  const dispatch = useDispatch();

  let inputs = [
    {
      input: "name",
      type: "text",
      limit: 10
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
    { input: "notes", type: "text", limit: 20 }
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
    r.arrived = false;

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
      <div className="reservation-form">
        <div className="inputs">
          {inputs.map(x => (
            <input
              id={x.input}
              key={x.input}
              placeholder={x.input}
              type={x.type}
              maxLength={x.limit}
            />
          ))}

          <div className="toggle">
            CONFIRMED
            <label>
              <input type="checkbox" id="confirmed" />
              <span />
            </label>
          </div>

          <input type="time" id="time" />
        </div>

        <div className="buttons">
          <button
            id="cancel-button"
            onClick={() => {
              resetui();
            }}
          >
            cancel
          </button>

          <button
            id="save-button"
            onClick={() => {
              if (
                newReservation().people > 0 &&
                newReservation().time !== {} &&
                newReservation().name
              ) {
                dispatch(addReservation(newReservation()));

                addFBReservation(newReservation());

                resetui();
              }
            }}
          >
            {reservation ? "update" : "save"}
          </button>
        </div>
      </div>
    </S>
  );
};
