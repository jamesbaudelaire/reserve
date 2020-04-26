export function ID() {
  return parseInt(
    [...new Array(6)].map(x => Math.floor(Math.random() * 10)).join("")
  );
}

export const LS = {
  init() {
    this.offline = true;
    this.name = "reserve-app";
    let data = JSON.parse(localStorage.getItem(this.name));
    if (data !== null) {
      this.data = data;
    } else {
      this.data = {
        reservations: [],
        history: []
      };
      this.save(this.data);
    }
  },
  save(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  saveReservations(data) {
    if (this.offline) {
      this.data.reservations = data;
      localStorage.setItem(this.name, JSON.stringify(this.data));
    }
  }
};
