export default function validateNumberInput(value: string): boolean {
  // Comment: allowed -> "", 0, 234, 23.43; not-allowed -> 0e, 23.123, aaa,
  const pattern = /(^\d+(\.\d{0,2})?$)|(^$)/;
  return !isNaN(+value) && pattern.test(value);
}
