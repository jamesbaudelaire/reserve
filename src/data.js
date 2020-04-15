export const data = {
  rialto: {
    name: "The Rialto Restaurant",
    reservations: []
  },
  guest: {
    name: "Guest Mode",
    reservations: [
      {
        date: {
          year: 2020,
          month: "apr",
          number: 13
        },
        time: {
          hour: 1,
          minutes: 20
        },
        name: "john",
        people: 2,
        phone: "46793893",
        email: "email",
        notes: "notes",
        confirmed: false,
        arrived: false,
        id: 123214
      },
      {
        date: {
          year: 2020,
          month: "apr",
          number: 14
        },
        time: {
          hour: 20,
          minutes: 30
        },
        people: 2,
        name: "jane",
        phone: "0394238553",
        email: "email",
        notes: "notes",
        confirmed: true,
        arrived: true,
        id: 431341
      }
    ]
  }
};
