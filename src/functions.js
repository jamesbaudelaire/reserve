export function ID() {
  return [...new Array(6)].map(x => Math.floor(Math.random() * 10)).join("");
}
