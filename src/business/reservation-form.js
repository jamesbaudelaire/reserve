import React, { useState } from "react";

import styled from "styled-components";

import { CalendarUI } from "./calendar";

import { useDispatch, useSelector } from "react-redux";
import { addReservation } from "../redux/actions";

import { ID } from "./functions";

const S = styled.div`
  .reservation-form {
    background: grey;
  }
`;

export const ReservationForm = ({ ui, setui }) => {
  const dispatch = useDispatch();

  const [reservation, setReservation] = useState({
    date: {
      year: 2020,
      month: "apr",
      number: 10
    },
    time: {
      hour: 20,
      minutes: 20
    },
    name: "john",
    people: 2,
    phone: "123123213213",
    email: "email",
    notes: "notes",
    confirmed: false,
    id: ID()
  });

  let inputs = [
    {
      input: "name",
      type: "text"
    }
  ];

  return (
    <S>
      <div className="inputs">
        {inputs.map(x => (
          <input key={x.input} placeholder={x.input} type={x.type} />
        ))}
      </div>

      <div className="reservation-form">
        <button
          onClick={() => {
            dispatch(addReservation(reservation));

            setui(false);
          }}
        >
          test
        </button>
      </div>
    </S>
  );
};
