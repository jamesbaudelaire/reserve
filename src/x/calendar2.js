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
  max-width: 300px;
  text-transform: uppercase;
  font-size: 16px;
  display: inline-block;
  box-shadow: var(--shadow);
  padding: 10px;
  background: white;
  border-radius: 5px;
  .top {
    display: flex;
    .today-button {
      margin: 10px;
    }
    .year-nav {
      align-items: center;
      display: flex;
      position: absolute;
      right: 0;
      top: 0;
      margin: 5px;
      font-size: 20px;
      i {
        font-size: 30px;
        margin: 5px;
        transition: 0.3s;
        cursor: pointer;
        border-radius: 5px;
      }
      span {
        margin: 5px;
      }
    }
  }

  .months {
    overflow: scroll;
    white-space: nowrap;
    text-align: center;
    border-radius: 5px;
    .month:last-child {
      margin-right: 10px;
    }
  }

  .month {
    margin: 10px;
    padding: 4px 8px;
    display: inline-block;
  }
  .days {
    display: grid;
    justify-content: center;
    text-align: center;
    font-size: 18px;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, min-content);
  }

  .day {
    width: 20px;
    padding: 4px 8px;
    height: 20px;
    line-height: 20px;
    margin: 4px;
  }

  .day,
  .month {
    transition: 0.3s;
    cursor: pointer;
    border-radius: 5px;

    &:hover {
      box-shadow: var(--inset);
    }
  }

  .selected {
    background: var(--select);
    color: white;
    box-shadow: var(--inset);
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
    } else {
      today();
    }
  }, [day]);

  useEffect(() => {
    if (month) {
      document.getElementById(CalendarData.months[month]).scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "end"
      });
    }
  }, [month]);

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
      <div className="months">
        {CalendarData.months.map((x, i) => (
          <div
            key={x}
            id={x}
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
    </S>
  );
};
