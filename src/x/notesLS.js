export const notesLS = {
  init() {
    this.guest = true;
    this.name = "reserve-app-notes";
    let data = JSON.parse(localStorage.getItem(this.name));
    if (data !== null) {
      this.data = data;
    } else {
      this.data = [];
      this.save(this.data);
    }
  },
  save(data) {
    if (this.guest) {
      localStorage.setItem(this.name, JSON.stringify(data));
    }
  }
};
