import { Calendar } from "./calendar";

export function ID() {
  let alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
  ];
  return [...new Array(10)]
    .map(x => alphabet[Math.floor(Math.random() * 26)])
    .join("");
}

let cal = new Calendar();

let sample = [
  {
    confirmed: false,
    date: { year: cal.year(), month: cal.monthNumber(), day: cal.dayNumber() },
    email: "jane@gmail.com",
    timestamp: cal.timeStamp(),
    id: ID(),
    name: "jane",
    notes: "birthday",
    people: 3,
    phone: "777-777-7777",
    time: {
      hour: 13,
      minutes: 30
    }
  },

  {
    confirmed: true,
    date: { year: cal.year(), month: cal.monthNumber(), day: cal.dayNumber() },
    email: "john@gmail.com",
    id: ID(),
    name: "john",
    timestamp: cal.timeStamp(),
    notes: "",
    people: 5,
    phone: "777-777-7777",
    time: {
      hour: 14,
      minutes: 0
    }
  },
  {
    confirmed: true,
    date: { year: cal.year(), month: cal.monthNumber(), day: cal.dayNumber() },
    email: "jack@gmail.com",
    id: ID(),
    name: "jack",
    timestamp: cal.timeStamp(),
    notes: "",
    people: 3,
    phone: "777-777-7777",
    time: {
      hour: 15,
      minutes: 0
    }
  }
];

export const LS = {
  init() {
    this.guest = true;
    this.name = "reserve-app";
    let data = JSON.parse(localStorage.getItem(this.name));
    if (data !== null) {
      this.data = data;
    } else {
      this.data = {
        reservations: sample
      };
      this.save(this.data);
    }
  },
  save(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  saveReservations(data) {
    if (this.guest) {
      this.data.reservations = data;
      localStorage.setItem(this.name, JSON.stringify(this.data));
    }
  }
};
