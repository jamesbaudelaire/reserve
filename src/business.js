import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import { getData } from "./redux/actions";
import { Reservations } from "./business/reservations";

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

  const data = useSelector(s => s.data);

  useEffect(() => {
    dispatch(getData(business));
  });

  let url = `https://randomuser.me/api/portraits/men/75.jpg`;

  return (
    <S>
      {data.name ? (
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
