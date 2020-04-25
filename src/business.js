import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import styled from "styled-components";

import { Reservations } from "./business/reservations";

import { LS } from "./functions";
import { loadReservations } from "./redux/actions";

import { FB, A } from "./firebase";

import { uid } from "./redux/actions";
import { Login } from "./login";

const S = styled.div`
  .topbar {
    display: flex;
    align-items: center;
    position: relative;
  }
  .business-name {
    /* position:absolute;left:90px;top:30px; */
    font-size: 30px;
  }

  .logo {
    background-size: cover;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    /* position: absolute; */
    top: 0;
    left: 0;
    margin: 20px;
  }

  .logout {
    position: absolute;
    right: 0;
    top: 20px;
  }

  @media screen and (min-width: 700px) {
  .topbar{
    flex-direction:row-reverse;
    position:absolute;top:0;right:0;
    
  }
  .logout {
    top: 90px;
  }
  }
`;

export const Business = () => {
  let { url } = useParams();

  const [name, setName] = useState();

  const dispatch = useDispatch();

  const [user, setUser] = useState(false);

  let ref = FB.firestore().collection("business");

  useEffect(() => {
    if (url === "guest") {
      LS.init();
      dispatch(loadReservations(LS.data.reservations));
      setUser(true);
      setName("Guest");
    } else {
      FB.auth().onAuthStateChanged(user => {
        if (user) {
          ref
            .doc(user.uid)
            .get()
            .then(doc => {
              let data = doc.data();
              if (url === data.url) {
                setUser(true);
                setName(data.name);
                dispatch(uid(user.uid));
                loadFBReservations(user.uid);
              }
            });
        }
      });
    }
  }, []);

  let loadFBReservations = uid => {
    ref
      .doc(uid)
      .collection("reservations")
      .onSnapshot(q => {
        let res = [];

        q.forEach(d => {
          let r = d.data();
          res.push(r);
        });

        dispatch(loadReservations(res));
      });
  };

  // let logo = `${business}`;
  let logo = `https://randomuser.me/api/portraits/men/75.jpg`;

  return (
    <S>
      {user ? (
        <>
          <div className="topbar">
            <img alt="logo" src={logo} className="logo" />
            <div className="business-name">{name}</div>
          </div>
          {
              // url !== "guest" &&
              <button
                className="logout"
                onClick={() => {
                  A.logout();
                  setUser(false);
                }}
              >
                logout
              </button>
            }

          <Reservations />
        </>
      ) : (
        <Login />
      )}
    </S>
  );
};
