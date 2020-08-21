import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";

const S = styled.div`
  .unconfirmed-reservations {
    box-shadow: var(--inset);
    margin: 20px;
    border-radius: 5px;

    div {
      overflow: auto;
      white-space: nowrap;
      padding: 15px 0 20px 0;
      button {
        &:last-child {
          margin-right: 20px;
        }
      }
      .unconfirmed-reservation {
        margin: 0;
        margin-left: 20px;
        transition: 0.3s;
        opacity: 0;
        transform: translatex(20px);
        &.io {
          opacity: 1;
          transform: translatex(0px);
        }
      }
    }
    span {
      padding: 10px 0px 0 10px;
      display: block;
    }
  }

  .guest-reservation {
    background: #fea944;
  }

  /* @media screen and (max-width: 1000px) {
    .unconfirmed-reservations {
      button {
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  } */

  @media screen and (min-width: 1000px) {
    .unconfirmed-reservations {
      position: fixed;
      right: 0;
      left: 0;
      top: 20px;
      padding: unset;
      margin: auto;
      width: calc(100% - 440px);

      div {
        overflow: scroll;
        padding-top: 10px;
        display: block;
        .unconfirmed-reservation {
          margin-top: 0;
        }
      }
    }
  }
`;

export const Unconfirmed = ({
  reservation,
  setReservation,
  setDay,
  unconfirmed,
  unconfirmedGR,
  setAddReservationUI
}) => {
  return (
    <S>
      {unconfirmed.length + unconfirmedGR.length > 0 && (
        <div className="unconfirmed-reservations">
          <span>{unconfirmed.length + unconfirmedGR.length} UNCONFIRMED</span>
          <div>
            {unconfirmedGR.map((r) => (
              <button
                className={`unconfirmed-reservation guest-reservation
                ${reservation && reservation.id == r.id ? "selected" : ""}
                `}
                key={r.id}
                onClick={() => {
                  setDay(r.date);
                  setReservation(null);
                  setReservation(r);
                  setAddReservationUI(true);
                }}
              >
                {r.name}
              </button>
            ))}

            {unconfirmed.map((r) => (
              <button
                className={`unconfirmed-reservation
                ${reservation && reservation.id == r.id ? "selected" : ""}
                `}
                key={r.id}
                onClick={() => {
                  setDay(r.date);
                  setReservation(null);
                  setReservation(r);
                  setAddReservationUI(true);
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </S>
  );
};
