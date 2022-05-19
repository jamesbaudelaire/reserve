import React, { useEffect } from "react";

import styled from "styled-components";

import { useDispatch } from "react-redux";
import { addReservation, deleteReservation } from "../redux/actions";

import { ID } from "../x/functions";

import { useAnimation } from "../x/animation";

import { DB } from "../x/firebase";

const S = styled.div`
  .reservation-form {
    padding-bottom: 40px;
    box-shadow: var(--shadow);
    position: fixed;
    border-radius: 10px;
    z-index: 100;
    width: 320px;

    bottom: 0px;
    right: 0px;

    .buttons {
      #delete-button {
        position: absolute;
        bottom: 0;
      }
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
    &.loaded {
      opacity: 1;
      bottom: 20px;
      right: 20px;
    }
  }

  .toggle {
    line-height: 20px;
    margin: 20px;
    display: flex;
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
          background-color: white;
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

  .inputs {
    box-shadow: var(--inset);
    margin: 20px;
    border-radius: 10px;
    height: 200px;

    overflow: scroll;
    .input {
      width: 90%;

      margin: 10px;
      i {
        font-size: 30px;
        margin-left: 10px;
      }
    }

    .text {
      white-space: nowrap;
      overflow: scroll;
    }

    input:required {
      border-left: 5px solid var(--red);
      box-sizing: border-box;
    }
    input:valid {
      border: none;
    }
  }

  .reservation-note {
    margin: 10px;

    i {
      font-size: 30px;
      margin-left: 10px;
      display: block;
    }
    textarea {
      resize: none;
      margin: 10px;
      border-radius: 5px;
      border: none;
      box-shadow: var(--inset);
      padding: 5px 10px;
    }
  }

  .clickable {
    color: var(--theme);
    cursor: pointer;
  }

  @media screen and (min-width: 1000px) {
    .reservation-form {
      right: unset;
      left: 0px;
      &.loaded {
        left: 20px;
      }
      .inputs {
        height: 380px;
      }
    }
    /* .reservation-form {
    &.loaded {
      top:90px;
      bottom: unset;
    } */

    /* .reservation-form {
      margin: 20px;
      border-radius: 10px;
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
        display: block;
        label {
          margin: 10px 0;
          display: block;
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
    } */
    /* #add-button {
      position: unset;
      margin: 10px;
    } */
  }
`;

let convertSingle = (x) => {
  if (x < 10) {
    return `0${x}`;
  } else {
    return x;
  }
};

export const ReservationForm = ({
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
      limit: 15,
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
    }

    // { input: "notes", type: "text", icon: "note", limit: 15 }
  ];

  useEffect(() => {
    if (reservation) {
      inputs.forEach((x) => {
        document.getElementById(x.input).value = reservation[x.input];
      });

      document.getElementById("notes").value = reservation["notes"];

      ["phone", "email"].forEach((x) => {
        document.getElementById(x).value = reservation[x];
      });

      document.getElementById("confirmed").checked = reservation.confirmed;
      document.getElementById("time").value = `${convertSingle(
        reservation.time.hour
      )}:${convertSingle(reservation.time.minutes)}`;

      document.getElementById("phone-link").href = `tel:${reservation.phone}`;

      document.getElementById(
        "email-link"
      ).href = `mailto:${reservation.email}`;
    }
  }, [reservation]);

  let convertTime = (x) => {
    if (x === "") {
      return null;
    }
    let time = {};

    time.hour = parseInt(x.substring(0, 2));

    time.minutes = parseInt(x.substring(3, 5));

    return time;
  };

  let timeStamp = (day) => {
    return new Date(day).getTime();
  };

  let newReservation = () => {
    let r = {};
    inputs.forEach((x) => {
      r[x.input] = document.getElementById(x.input).value;
    });

    r["notes"] = document.getElementById("notes").value;

    ["phone", "email"].forEach((x) => {
      r[x] = document.getElementById(x).value;
    });

    r.people = parseInt(r.people);

    if (day) {
      r.date = {
        year: day.year,
        month: day.month,
        day: day.day
      };
    }

    if (day) {
      r.timestamp = timeStamp(`${day.month + 1}/${day.day}/${day.year}`);
    }

    r.confirmed = document.getElementById("confirmed").checked;

    if (reservation) {
      r.id = reservation.id;
      if (reservation.rsrv) {
        r.rsrv = true;
      }
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

  let scroll = (id) => {
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
            {inputs.map((x) => (
              <div key={x.input} className="input">
                <i className="material-icons-round">{x.icon}</i>
                <input
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
            <i className="material-icons-round">schedule</i>
            <input type="time" id="time" defaultValue="12:00" required />
          </div>

          {
            <div className="reservation-note">
              <i className="material-icons-round">note</i>
              <textarea
                className="note"
                id="notes"
                rows="3"
                maxLength="50"
                placeholder={inputs.notes}
              ></textarea>
            </div>
          }

          <div className="text">
            <div className="input">
              <a id="phone-link" rel="noopener noreferrer">
                <i className="material-icons-round clickable">phone</i>
              </a>
              <input
                id="phone"
                placeholder="phone"
                type="text"
                maxLength="10"
              />
            </div>

            <div className="input">
              <a id="email-link" rel="noopener noreferrer" target="_blank">
                <i className="material-icons-round clickable">email</i>
              </a>
              <input
                id="email"
                placeholder="email"
                type="email"
                maxLength="50"
              />
            </div>
          </div>

          {/* {inputs.map(x => (
              <div key={x.input} className="input">
                <i className="material-icons-round">{x.icon}</i>
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
            ))} */}
        </div>

        <div className="buttons">
          <button
            id="close-button"
            onClick={() => {
              resetui();
            }}
          >
            <i className="material-icons-round">minimize</i>
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

          {
            <button
              id="add-button"
              onClick={() => {
                let r = newReservation();
                if (r.people > 0 && r.name && r.time) {
                  if (reservation && reservation.gr) {
                    DB.deleteGR(url, reservation.id);
                  }

                  dispatch(addReservation(r));

                  addFBReservation(r);

                  resetui();
                }
              }}
            >
              {reservation ? (reservation.gr ? "approve" : "update") : "add"}
            </button>
          }
        </div>
      </div>
    </S>
  );
};
