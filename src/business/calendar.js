import React, { useState, useLayoutEffect } from "react";

import styled from "styled-components";

export const CalendarData = {
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
  days: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ]
};

export class Calendar {
  constructor() {
    this.date = new Date();
  }

  dayLetter() {
    return CalendarData.days[this.date.getDay()];
  }
  day() {
    return CalendarData.days[this.date.getDay()];
  }
}

const S = styled.div`
  text-transform: uppercase;
  position: relative;
  user-select: none;
  font-size: 20px;
  display: inline-block;
  .week {
    display: grid;
    grid-template-columns: repeat(7, min-content);
  }
  .day {
    transition: 0.3s;
    width: 40px;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
  }
  .days {
    text-align: center;
  }
  .selected {
    color: white;
    background: var(--select);
  }

  .nav {
    position: absolute;
    right: 0;
    top: 0;
    i {
      font-size: 40px;
      cursor: pointer;
    }
  }
  .year {
    display: inline-block;
    font-weight: bold;
  }
  .month {
    margin: 10px;
    display: inline-block;
    font-weight: bold;
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

let clearSelected = () => {
  document
    .querySelectorAll(".day")
    .forEach(day => day.classList.remove("selected"));
};

let selectDay = (day, name) => {
  clearSelected();
  if (day) {
    document.getElementById(`day-${day}`).classList.add("selected");
  }
};

export const CalendarUI = ({ day, setDay }) => {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [daynum, setDaynum] = useState(null);
  const [dayname, setDayname] = useState(null);

  // const dispatch = useDispatch();

  let Today = () => {
    clearSelected();

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let number = today.getDate();
    let name = CalendarData.days[today.getDay()];

    setYear(year);
    setMonth(month);
    setDaynum(number);
    setDayname(name);

    let day = {
      year,
      month: CalendarData.months[month],
      number,
      name
    };

    // dispatch(setDay(day));
    setDay(day);
  };

  useLayoutEffect(() => {
    Today();
  }, []);

  useLayoutEffect(() => {
    if (daynum) {
      selectDay(daynum, dayname);
    }
  }, [daynum]);

  let start = new Date(year, month, 1).getDay();

  let end = new Date(year, month + 1, 0).getDate();

  useLayoutEffect(() => {
    if (month == -1) {
      setMonth(11);
      setYear(year - 1);
    }
    if (month == 12) {
      setMonth(0);
      setYear(year + 1);
    }
  }, [month]);

  let nav = x => {
    clearSelected();

    setMonth(month + x);
    setDaynum(null);

    start = new Date(year, month, 1).getDay();

    end = new Date(year, month + 1, 0).getDate();
  };

  return (
    <S className="calendar">
      <div className="month">{CalendarData.months[month]}</div>

      <div className="year">{year}</div>

      <div className="nav">
        <i
          className="material-icons back"
          onClick={() => {
            nav(-1);
          }}
        >
          chevron_left
        </i>
        <i
          className="material-icons home"
          onClick={() => {
            Today();
            selectDay(daynum, dayname);
          }}
        >
          expand_more
        </i>
        <i
          className="material-icons forward"
          onClick={() => {
            nav(1);
          }}
        >
          chevron_right
        </i>
      </div>

      <div className="days">
        <div className="week">
          {CalendarData.days.map((day, i) => (
            <div className="day" id={day} key={`day-${i}`}>
              {day[0]}
            </div>
          ))}
        </div>
        {days(start, end).map((week, i) => (
          <div className="week" key={`week-${i}`}>
            {week.map((day, i) => (
              <div
                key={`day-${i}`}
                className="day"
                id={`day-${day}`}
                onClick={() => {
                  let dayname = CalendarData.days[i];
                  let monthname = CalendarData.months[month];
                  setDaynum(null);
                  if (day) {
                    setDay({
                      year,
                      month: monthname,
                      number: day,
                      name: dayname
                    });

                    selectDay(day, dayname);
                  }
                }}
              >
                {day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </S>
  );
};
