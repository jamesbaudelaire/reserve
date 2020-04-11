export function ID() {
  return parseInt(
    [...new Array(6)].map(x => Math.floor(Math.random() * 10)).join("")
  );
}
