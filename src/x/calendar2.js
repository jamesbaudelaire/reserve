import React, { useState, useEffect, useLayoutEffect } from "react";

import styled from "styled-components";

const CalendarData = {
  months: [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
  ],
  days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
};

export class CalendarFunctions {
  constructor() {
    this.date = new Date();
  }

  dayName() {
    return CalendarData.days[this.date.getDay()];
  }
  dayNumber() {
    return this.date.getDate();
  }

  year() {
    return this.date.getFullYear();
  }
  monthNumber() {
    return this.date.getMonth();
  }
  monthName() {
    return CalendarData.months[this.date.getMonth()];
  }
}

let cal = new CalendarFunctions();

const S = styled.div`
  position: relative;
  text-transform: uppercase;
  font-size: 12px;
  display: inline-block;
  box-shadow: var(--shadow);
  padding: 20px;
  padding-bottom: 0;
  border-radius: 5px;
  .top {
    display: flex;
    .today-button {
      margin: 0;
    }
    .year-nav {
      align-items: center;
      display: flex;
      position: absolute;
      right: 0;
      top: 0;
      margin: 10px;
      font-size: 15px;
      i {
        font-size: 30px;
        background: var(--grey);
      }
    }
  }
  .bottom {
    display: flex;
    .months {
      height: 200px;
      overflow: scroll;
      margin-top: 10px;
      text-align: center;
      box-shadow: var(--shadow);
      border-radius: 5px;
    }
    .month {
      margin: 5px;
      padding: 5px;
    }
    .days {
      text-align: center;
      margin: 10px;
    }
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, min-content);
  }

  .day {
    width: 20px;
    padding: 3px;
    height: 20px;
    line-height: 20px;
    margin: 2px;
  }

  .day,
  .month {
    transition: 0.3s;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      box-shadow: var(--shadow);
    }
  }

  .selected {
    background: var(--select);
    color: white;
    box-shadow: var(--shadow);
  }
`;

let days = (start, end) => {
  let state = false;
  let n = 1;
  let DS = [];

  for (let i = 0; i <= 5; i++) {
    let week = [];

    for (let j = 0; j <= 6; j++) {
      if (start === j) {
        state = true;
      }

      if (state && n <= end) {
        week.push(n);
        n++;
      } else {
        week.push(null);
      }
    }
    DS.push(week);
  }

  return DS;
};

export const Calendar = ({ day, setDay }) => {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [dayNumber, setDaynumber] = useState(0);

  let today = () => {
    setYear(cal.year());
    setMonth(cal.monthNumber());
    setDaynumber(cal.dayNumber());

    let day = {
      year: cal.year(),
      month: cal.monthNumber(),
      day: cal.dayNumber()
    };

    setDay(day);
  };

  useEffect(() => {
    if (day) {
      setYear(day.year);
      setMonth(day.month);
      setDaynumber(day.day);
    }
  }, [day]);

  let start = new Date(year, month, 1).getDay();

  let end = new Date(year, month + 1, 0).getDate();

  return (
    <S className="calendar">
      <div className="top">
        <button
          className="today-button"
          onClick={() => {
            today();
          }}
        >
          today
        </button>
        <div className="year-nav">
          <i
            className="material-icons back"
            onClick={() => {
              setYear(year - 1);
            }}
          >
            chevron_left
          </i>
          <span>{year}</span>
          <i
            className="material-icons back"
            onClick={() => {
              setYear(year + 1);
            }}
          >
            chevron_right
          </i>
        </div>
      </div>
      <div className="bottom">
        <div className="months">
          {CalendarData.months.map((x, i) => (
            <div
              key={x}
              className={`month ${month == i ? "selected" : ""}`}
              onClick={() => {
                setMonth(i);
              }}
            >
              {x}
            </div>
          ))}
        </div>
        <div className="days">
          <div className="week">
            {CalendarData.days.map((d, i) => (
              <div className="day" id={d} key={`day-${i}`}>
                {d[0]}
              </div>
            ))}
          </div>
          {days(start, end).map((w, i) => (
            <div className="week" key={`week-${i}`}>
              {w.map((d, i) => (
                <div
                  key={`day-${i}`}
                  className={`day ${dayNumber == d ? "selected" : ""}`}
                  onClick={() => {
                    if (d) {
                      setDay({
                        year,
                        month,
                        day: d
                      });
                    }
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </S>
  );
};
