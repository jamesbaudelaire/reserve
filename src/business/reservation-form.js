import React, { useEffect } from "react";

import styled from "styled-components";

import { useDispatch } from "react-redux";
import { addReservation, deleteReservation } from "../redux/actions";

import { ID } from "../functions";

import { useAnimation } from "../x/animation";

const S = styled.div`
  .reservation-form {
    position: fixed;
    background: rgb(200, 200, 200);
    bottom: 0;
    left: 0%;
    z-index: 100;

    .buttons {
      #close-button {
        position: absolute;
        top: 0;
        right: 0;
      }
      button {
        margin: 10px;
      }
    }

    opacity: 0;
    transition: 0.3s;
    transform: translatey(20px);
    &.loaded {
      opacity: 1;
      transform: translatey(0px);
    }
  }

  .toggle {
    margin: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    display: block;
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
        border-radius: 5px;
        &:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: 2.5px;
          bottom: 2.5px;
          background-color: white;
          transition: 0.4s;
          border-radius: 4px;
          box-shadow: var(--shadow);
        }
      }
    }
  }

  textarea {
    resize: none;
  }

  .inputs {
    input {
      margin: 10px;
      width: 120px;
    }
    input:last-child {
      margin-right: 20px;
    }
    .text {
      white-space: nowrap;
      overflow: scroll;
      width: 100vw;
    }

    input:required {
      border-left: 3px solid #d50000;
      box-sizing: border-box;
    }
    input:valid {
      border: none;
    }
  }

  @media screen and (min-width: 1000px) {
    .reservation-form {
      margin: 20px;
      border-radius: 5px;
      width: 200px;
      box-shadow: var(--shadow);
      top: 0;
      bottom: unset;
      .text {
        width: unset;
        white-space: unset;
      }
      transform: translatey(0px);

      .toggle {
        margin: 10px;
        label {
          margin: 10px 0;
          display: block;
        }
      }
    }
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
  addFBReservation,
  deleteFBReservation
}) => {
  const dispatch = useDispatch();

  let inputs = [
    {
      input: "name",
      type: "text",
      limit: 10,
      req: true
    },
    {
      input: "people",
      type: "number",
      req: true
    },
    {
      input: "email",
      type: "email"
    },
    {
      input: "phone",
      type: "text"
    },
    { input: "notes", type: "text", limit: 10 }
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
    if (x === "") {
      return null;
    }
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
      day: day.day
    };

    r.confirmed = document.getElementById("confirmed").checked;
    // r.arrived = false;

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

  const load = useAnimation();

  let scroll = id => {
    document.getElementById(id).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  };

  return (
    <S>
      <div className="reservation-form" {...load}>
        <div className="toggle">
          CONFIRMED
          <label>
            <input type="checkbox" id="confirmed" />
            <span />
          </label>
        </div>

        <div className="inputs">
          <div className="text">
            {inputs.map(x => (
              <input
                onClick={() => {
                  scroll(x.input);
                }}
                id={x.input}
                key={x.input}
                placeholder={x.input}
                type={x.type}
                maxLength={x.limit}
                required={x.req}
              />
            ))}
          </div>

          <input type="time" id="time" required />
        </div>

        <div className="buttons">
          <button
            id="close-button"
            onClick={() => {
              resetui();
            }}
          >
            close
          </button>

          {reservation && (
            <button
              id="delete-button"
              onClick={() => {
                if (window.confirm("Delete this reservation?")) {
                  resetui();
                  dispatch(deleteReservation(reservation.id));
                  deleteFBReservation(reservation);
                }
              }}
            >
              delete
            </button>
          )}

          <button
            id="add-button"
            onClick={() => {
              if (
                newReservation().people > 0 &&
                newReservation().name &&
                newReservation().time
              ) {
                dispatch(addReservation(newReservation()));

                addFBReservation(newReservation());

                resetui();
              }
            }}
          >
            {reservation ? "update" : "add"}
          </button>
        </div>
      </div>
    </S>
  );
};
