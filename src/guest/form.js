import React, { useState, useEffect } from "react";
import { CalendarUI } from "../x/calendar";
import { useParams } from "react-router-dom";
import { FB } from "../x/firebase";
import { ReactComponent as None } from "../assets/no-reservations.svg";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ID } from "../x/functions";

import { DB } from "../x/firebase";

import { ReactComponent as Contact } from "../assets/contact.svg";

const S = styled.div`
  opacity: 0;
  transition: 1s;
  &.loaded {
    opacity: 1;
  }

  .app-name {
    display: inline-block;
    cursor: pointer;
    font-size: 40px;
    margin: 10px 20px;
    color: var(--theme);
    transition: 0.3s;
    &:hover {
      color: var(--select);
    }
  }

  .not-found {
    p {
      margin: 20px;
      font-size: 20px;
    }

    svg {
      width: calc(100% - 40px);
      height: 200px;
      margin: 20px;
      position: absolute;
      bottom: 0;
    }

    i {
      font-size: 40px;
      color: var(--theme);
      position: absolute;
      top: 0;
      right: 0%;
      margin: 10px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: var(--select);
      }
    }
  }
  .inputs {
    input:required {
      border-left: 5px solid var(--theme);
      box-sizing: border-box;
    }
    input:valid {
      border: none;
    }
  }

  .business-name {
    font-size: 30px;
    position: absolute;
    top: 0;
    right: 70px;
    margin: 20px;
  }
  .logo {
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
    height: 50px;
    width: 50px;
    box-shadow: var(--shadow);
    border-radius: 5px;
  }

  .calendar {
    margin: 20px auto;
    display: block;
    width: min-content;
    margin-top: 50px;
  }

  .inputs {
    border-radius: 10px 10px 0px 0px;

    i {
      font-size: 30px;
    }
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgb(200, 200, 200);
    .text {
      white-space: nowrap;
      width: 100vw;
      overflow: scroll;
    }
    .input {
      margin: 20px 10px;
      display: inline-block;

      input {
        width: 120px;
      }
    }
    .time {
      margin: 20px;
      margin-top: 0;
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 20px;
  }

  .submitted {
    font-size: 20px;
    margin: 20px auto;
    margin-top: 100px;
    text-align: center;
    max-width: 400px;
  }

  #contact-svg {
    width: 100%;
    height: 200px;
  }

  @media screen and (max-width: 1000px) {
    .text {
      .input {
        &:first-child {
          margin-left: 20px;
        }
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }

  @media screen and (min-width: 1000px) {
    .logo {
      position: fixed;
      top: 0;
      right: 0;
    }
    .app-name {
      position: fixed;
      top: 0;
      left: 0;
    }
    .business-name {
      position: fixed;
    }

    .calendar {
      position: absolute;
      top: 0;
      right: 0;
      margin: 20px;
    }

    .inputs {
      background: unset;
      margin: 20px 30px;
      position: absolute;
      top: 0;
      bottom: unset;
      .text {
        display: grid;
        width: unset;
      }

      .input,
      .time {
        margin: 0;
        display: flex;
        align-items: center;
      }
    }

    .submit {
      position: unset;
      margin: 10px 0;
    }
  }
`;

let scroll = id => {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center"
  });
};

let convertTime = x => {
  if (x === "") {
    return null;
  }
  let time = {};

  time.hour = parseInt(x.substring(0, 2));

  time.minutes = parseInt(x.substring(3, 5));

  return time;
};

export const Form = () => {
  const [day, setDay] = useState();

  let { business } = useParams();
  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_500/v1587884625/reserve/${business}.png`;

  const [listed, setListed] = useState(true);
  const [name, setName] = useState();
  const [submit, setSubmit] = useState(true);

  useEffect(() => {
    FB.firestore()
      .collection("public")
      .doc(business)
      .get()
      .then(doc => {
        let data = doc.data();
        if (data) {
          setName(data.name);
        } else {
          setListed(false);
        }
        setTimeout(() => {
          document.getElementById("form").classList.add("loaded");
        }, 300);
      });
  }, []);

  let inputs = [
    {
      input: "phone",
      icon: "phone",
      type: "text",
      req: true
    },
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
      icon: "people",
      req: true
    },

    {
      input: "email",
      icon: "email",
      type: "email"
    }
  ];

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

    r.confirmed = false;

    r.gr = true;

    r.rsrv = true;

    r.id = ID();

    r.notes = "";

    r.time = convertTime(document.getElementById("time").value);
    return r;
  };

  let addFBReservation = r => {
    DB.guest(business, r);
  };

  return (
    <S id="form">
      <Link to="/">
        <div className="app-name">RSRV</div>
      </Link>

      {name && (
        <>
          <div className="business-name">{name}</div>
          <img alt="logo" src={logo} className="logo" />

          {submit && <CalendarUI day={day} setDay={setDay} />}
        </>
      )}

      {!listed && (
        <div className="not-found">
          <p>Business not listed!</p>
          <None />
          <Link to="/">
            <i className="material-icons-round" onClick={() => {}}>
              home
            </i>
          </Link>
        </div>
      )}

      {name && submit && (
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

          <button
            className="submit"
            onClick={() => {
              let r = newReservation();
              if (r.people > 0 && r.name && r.time && r.phone) {
                addFBReservation(r);
                setSubmit(false);
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: "smooth"
                });
              }
            }}
          >
            submit
          </button>
        </div>
      )}

      {!submit && (
        <div className="submitted">
          <Contact id="contact-svg" />
          <h2>Thank You!</h2>
          We'll contact you later on to confirm!
        </div>
      )}
    </S>
  );
};
