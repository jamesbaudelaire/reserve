import React, { useEffect } from "react";
import { FB, DB } from "../x/firebase";
import styled from "styled-components";

const S = styled.div`
  #days {
    text-transform: uppercase;
    margin: 0 20px;
    border-radius: 5px;
    display: inline-block;
    box-shadow: var(--shadow);
    @media screen and (min-width: 1000px) {
      position: fixed;
      top: 100px;
      right: 20px;
    }
  }

  .toggle {
    line-height: 20px;
    margin: 20px;
    display: flex;
    label {
      margin-left: 10px;
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      input {
        opacity: 0;
        width: 0;
        height: 0;
        &:checked + span {
          background: var(--theme);
        }
        &:checked + span:before {
          transform: translateX(20px);
          background-color: white;
        }
      }
      span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: var(--inset);
        transition: 0.4s;
        border-radius: 5px;
        &:before {
          position: absolute;
          content: "";
          height: 15px;
          width: 15px;
          left: 2.5px;
          bottom: 2.5px;
          background-color: var(--theme);
          transition: 0.4s;
          border-radius: 4px;
          box-shadow: var(--shadow);
        }
      }
    }
  }

  .update-days {
    margin: 20px;
    margin-top: 0;
  }
`;

export const Settings = ({ url }) => {
  let days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  let updateDays = () => {
    let temp = {};
    days.forEach((d) => {
      temp[d] = document.getElementById(`${d}-status`).checked;
    });
    DB.days(temp, url);
  };

  useEffect(() => {
    FB.firestore()
      .collection("public")
      .doc(url)
      .collection("settings")
      .doc("days")
      .get()
      .then((doc) => {
        let data = doc.data();
        Object.keys(data).forEach((d) => {
          document.getElementById(`${d}-status`).checked = data[d];
          if (data[d]) {
            document.getElementById(d).classList.add("open");
          } else {
            document.getElementById(d).classList.add("closed");
          }
        });
      });
  }, []);

  return (
    <S>
      <div id="days">
        {days.map((d) => (
          <div className="toggle" key={d}>
            {d}
            <label>
              <input type="checkbox" id={`${d}-status`} />
              <span />
            </label>
          </div>
        ))}
        <button
          className="update-days"
          onClick={() => {
            updateDays();
          }}
        >
          update
        </button>
      </div>
    </S>
  );
};
