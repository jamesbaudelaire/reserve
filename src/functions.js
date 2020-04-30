import { Calendar } from "./business/calendar";

let cal = new Calendar();

export function ID() {
  return parseInt(
    [...new Array(6)].map(x => Math.floor(Math.random() * 10)).join("")
  );
}

let sample = [
  {
    arrived: false,
    confirmed: false,
    date: { year: cal.year(), month: cal.monthName(), number: cal.dayNumber() },
    email: "jane@gmail.com",
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
    arrived: false,
    confirmed: true,
    date: { year: cal.year(), month: cal.monthName(), number: cal.dayNumber() },
    email: "john@gmail.com",
    id: ID(),
    name: "john",
    notes: "",
    people: 5,
    phone: "777-777-7777",
    time: {
      hour: 14,
      minutes: 0
    }
  },
  {
    arrived: true,
    confirmed: true,
    date: { year: cal.year(), month: cal.monthName(), number: cal.dayNumber() },
    email: "jack@gmail.com",
    id: ID(),
    name: "jack",
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
        reservations: sample,
        history: []
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
