import React, { useEffect } from "react";

import styled from "styled-components";

import { useDispatch } from "react-redux";
import { addReservation, deleteReservation } from "../redux/actions";

import { ID } from "../x/functions";

import { useAnimation } from "../x/animation";

import { DB } from "../x/firebase";

const S = styled.div`
  .reservation-form {
    position: fixed;
    background: rgb(200, 200, 200);
    bottom: 0;
    border-radius: 10px 10px 0 0;
    left: 0%;
    z-index: 100;

    .buttons {
      #close-button {
        position: absolute;
        top: 0px;
        right: 0px;
        border-radius: 0 10px 0 10px;
      }
      button {
        margin: 0px 0px 20px 20px;
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
    line-height: 20px;
    margin: 20px;
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
        box-shadow: var(--inset);
        background: white;
        transition: 0.4s;
        border-radius: 5px;
        &:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: 2.5px;
          bottom: 2.5px;
          background-color: var(--theme);
          transition: 0.4s;
          border-radius: 4px;
          box-shadow: var(--shadow);
        }
      }
    }
  }

  #add-button {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 20px;
  }

  textarea {
    resize: none;
  }

  .inputs {
    .time {
      margin: 10px;
    }
    .input {
      display: inline-block;
      input {
        width: 120px;
      }
      display: inline-block;
      i {
        font-size: 30px;
        margin-left: 10px;
      }
    }

    .text {
      white-space: nowrap;
      overflow: scroll;
      width: 100vw;

      .input:first-child {
        margin-left: 10px;
      }
      .input:last-child {
        margin-right: 10px;
      }
    }

    input:required {
      border-left: 3px solid var(--theme);
      box-sizing: border-box;
    }
    input:valid {
      border: none;
    }
  }

  @media screen and (min-width: 1000px) {
    .reservation-form {
      margin: 20px;
      border-radius: 10px;
      width: 200px;
      box-shadow: var(--shadow);
      padding-bottom: 0px;
      .text {
        width: unset;
        white-space: unset;
      }
      transform: translatey(0px);

      .toggle {
        margin: 10px;
        position: unset;
        margin: 10px 0 0 20px;
        label {
          margin: 10px 0;
          display: block;
        }
      }

      .inputs {
        margin: 0px;
        .input {
          display: flex;
          align-items: center;
        }
        .text {
          .input:first-child {
            margin-left: 0px;
          }
        }
        .time {
          margin: 0;
        }
      }

      .buttons {
        #close-button {
          top: -10px;
          right: 0px;
        }
        button {
          margin: 10px 0px 10px 10px;
        }
      }
    }
    #add-button {
      position: unset;
      margin: 10px;
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
  addFBReservation,
  deleteFBReservation,
  url
}) => {
  const dispatch = useDispatch();

  let inputs = [
    {
      input: "name",
      type: "text",
      limit: 10,
      icon: "face",
      req: true
    },
    {
      input: "people",
      type: "number",
      limit: 2,
      icon: "people",
      req: true,
      max: 99
    },
    {
      input: "email",
      icon: "email",
      type: "email",
      limit: 50
    },
    {
      input: "phone",
      icon: "phone",
      type: "text",
      limit: 10
    },
    { input: "notes", type: "text", icon: "note", limit: 15 }
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
    }
  }, [reservation]);

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
              <div key={x.input} className="input">
                <i className="material-icons back">{x.icon}</i>
                <input
                  onClick={() => {
                    scroll(x.input);
                  }}
                  id={x.input}
                  placeholder={x.input}
                  type={x.type}
                  max={x.max}
                  maxLength={x.limit}
                  required={x.req}
                />
              </div>
            ))}
          </div>

          <div className="input time">
            <i className="material-icons">schedule</i>
            <input type="time" id="time" required />
          </div>
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

          {reservation &&
            (reservation.gr ? (
              <button
                id="delete-button"
                onClick={() => {
                  if (window.confirm("Delete this reservation?")) {
                    resetui();
                    DB.deleteGR(url, reservation.id);
                  }
                }}
              >
                delete
              </button>
            ) : (
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
            ))}
          {reservation && reservation.gr ? (
            <button
              id="add-button"
              onClick={() => {
                reservation.gr = false;
                addFBReservation(reservation);
                DB.deleteGR(url, reservation.id);
                resetui();
              }}
            >
              add
            </button>
          ) : (
            <button
              id="add-button"
              onClick={() => {
                let r = newReservation();
                if (r.people > 0 && r.name && r.time) {
                  dispatch(addReservation(r));

                  addFBReservation(r);

                  resetui();
                }
              }}
            >
              {reservation ? "update" : "add"}
            </button>
          )}
        </div>
      </div>
    </S>
  );
};
