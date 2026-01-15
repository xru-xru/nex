// generates unique id based on current timestamp in milliseconds
// used for randomly generating id to used as key when rendering components
// from map
export function getUniqueId(): string {
  const uniqueId = new Date().getUTCMilliseconds().toString();
  return uniqueId;
}
