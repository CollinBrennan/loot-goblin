export function epochInSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000);
}
