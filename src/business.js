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
    height: 60px;
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
            <div className="business-name">{name}</div>
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
