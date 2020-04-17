export function ID() {
  return parseInt(
    [...new Array(6)].map(x => Math.floor(Math.random() * 10)).join("")
  );
}

export const LS = {
  init() {
    this.name = "reserve";
    let data = JSON.parse(localStorage.getItem(this.name));
    if (data !== null) {
      this.data = data;
    } else {
      this.data = [];
      this.save(this.data);
    }
  },
  save(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  }
};
