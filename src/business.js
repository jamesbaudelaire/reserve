import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { Reservations } from "./business/reservations";

import { data } from "./data";
import { setReservations } from "./redux/actions";

const S = styled.div`
  .logo {
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 0;
    margin: 20px;
  }
`;

export const Business = () => {
  let { business } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setReservations(data[business].reservations));
  });

  let url = `https://randomuser.me/api/portraits/men/75.jpg`;

  return (
    <S>
      {data[business].name ? (
        <>
          {data.name}

          <img alt="logo" src={url} className="logo" />

          <Reservations />
        </>
      ) : (
        "Business not found!"
      )}
    </S>
  );
};
