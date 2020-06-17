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
  .app-name {
    display: inline-block;
    cursor: pointer;
    font-size: 40px;
    margin: 10px 20px;
    color: var(--theme);
    transition: 0.3s;
    &:hover {
      color: var(--green);
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
  }
  .inputs {
    input:required {
      border-left: 5px solid var(--red);
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
    background: white;
    top: 0;
    right: 0;
    margin: 20px;
    height: 50px;
    width: 50px;
    border-radius: 5px;
  }

  .calendar {
    margin: 20px auto;
    display: block;
    max-width: 300px;
  }

  .inputs {
    border-radius: 10px 10px 0px 0px;
    box-shadow: var(--shadow);

    i {
      font-size: 30px;
    }
    position: fixed;
    bottom: 0;
    left: 0;
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
    .inputs {
      box-shadow: var(--inset);
    }

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
      right: 0;
      top: 0px;
      margin: 20px;
    }

    .inputs {
      box-shadow: none;
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
  const [loading, setLoading] = useState(true);

  let { business } = useParams();
  let logo = `https://res.cloudinary.com/baudelaire/image/upload/w_100/v1587884625/reserve/${business}.png`;

  const [listed, setListed] = useState(true);
  const [data, setData] = useState();
  const [submit, setSubmit] = useState(true);

  useEffect(() => {
    FB.firestore()
      .collection("public")
      .doc(business)
      .get()
      .then(doc => {
        let data = doc.data();
        if (data) {
          setData(data);
          setLoading(false);
        } else {
          setListed(false);
          setLoading(false);
        }
      });
  }, []);

  let inputs = [
    {
      input: "phone",
      icon: "phone",
      type: "text",
      req: true,
      limit: 10
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
      req: true,
      max: 99
    },

    {
      input: "email",
      icon: "email",
      type: "email",
      limit: 50
    }
  ];

  let timeStamp = day => {
    return new Date(day).getTime();
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
    if (day) {
      r.timestamp = timeStamp(`${day.month + 1}/${day.day}/${day.year}`);
    }

    r.confirmed = false;

    r.rsrv = true;
    r.gr = true;

    r.id = ID();

    r.notes = "";

    r.time = convertTime(document.getElementById("time").value);
    return r;
  };
  let addFBReservation = r => {
    DB.guest(business, r);
    DB.email({
      to: data.email,
      message: {
        subject: "New reservation!",
        html: `
        <h3>${r.name} wants a reservation for ${r.people}</h3>
       <a href="https://rsrv.netlify.app/"><button>RSRV</button></a>
        `
      }
    });
  };

  return (
    <S id="guest-form">
      {loading && (
        <div className="loading-line">
          <div />
        </div>
      )}

      <Link to="/">
        <div className="app-name">RSRV</div>
      </Link>

      {data && (
        <>
          <div className="business-name">{data.name}</div>
          <img alt="logo" src={logo} className="logo" />

          {submit && <CalendarUI day={day} setDay={setDay} />}
        </>
      )}

      {!listed && (
        <div className="not-found">
          <p>Business not listed...</p>
          <None />
        </div>
      )}

      {data && submit && (
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
                  max={x.max}
                />
              </div>
            ))}
          </div>

          <div className="input time">
            <i className="material-icons">schedule</i>
            <input type="time" id="time" required defaultValue="12:00" />
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
