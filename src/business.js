import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { Reservations } from "./business/reservations";

import { LS } from "./functions";
import { loadReservations } from "./redux/actions";

const S = styled.div`
  .topbar {
    position: relative;
    height: 100px;

    .name {
      margin: 20px;
      display: inline-block;
      font-size: 30px;
    }

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
  }
`;

export const Business = () => {
  let { business } = useParams();

  const [name, setName] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (business === "guest") {
      setName("Guest");
      LS.init();
      dispatch(loadReservations(LS.data));
    } else {
      //firebase init

      setName("Rialto");
    }
  }, []);

  // let logo = `${business}`;
  let logo = `https://randomuser.me/api/portraits/men/75.jpg`;

  return (
    <S>
      {name ? (
        <>
          <div className="topbar">
            <div className="name">{name}</div>
            <img alt="logo" src={logo} className="logo" />
          </div>
          <Reservations />
        </>
      ) : (
        "Business not found!"
      )}
    </S>
  );
};
