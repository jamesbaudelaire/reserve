import React, { useState, useEffect } from "react";
import { CalendarUI } from "../x/calendar";
import { useParams } from "react-router-dom";
import { FB } from "../x/firebase";
import { ReactComponent as None } from "../assets/no-reservations.svg";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { ID } from "../x/functions";

import { DB } from "../x/firebase";

import { useAnimation } from "../x/animation";

const S = styled.div`
  opacity: 0;
  transition: 1s;
  &.loaded {
    opacity: 1;
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
      border-left: 3px solid var(--theme);
      box-sizing: border-box;
    }
    input:valid {
      border: none;
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
  const [name, setName] = useState("Rialto");
  const [submit, setSubmit] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      document.getElementById("form").classList.add("loaded");
    }, 300);
  });

  // useEffect(() => {
  //   FB.firestore()
  //     .collection("public")
  //     .doc(business)
  //     .get()
  //     .then(doc => {
  //       let data = doc.data();
  //       if (data) {
  //         setName(data.name);
  //       } else {
  //         setListed(false);
  //       }
  //     });
  // }, []);

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
      icon: "people",
      req: true
    },
    {
      input: "email",
      icon: "email",
      type: "email"
    },
    {
      input: "phone",
      icon: "phone",
      type: "text"
    },
    { input: "notes", type: "text", icon: "note", limit: 15 }
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

    r.id = ID();

    r.time = convertTime(document.getElementById("time").value);
    return r;
  };

  let addFBReservation = r => {
    DB.guest(business, r);
  };

  return (
    <S id="form">
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
        <>
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
          </div>
          <button
            onClick={() => {
              let r = newReservation();
              if (r.people > 0 && r.name && r.time) {
                addFBReservation(r);
              }

              setSubmit(false);
            }}
          >
            submit
          </button>
        </>
      )}

      {!submit && (
        <>
          Reservation submitted,
          <br />
          {`${name}'s`} event coordinatior will contact you later on to confirm!
        </>
      )}
    </S>
  );
};
