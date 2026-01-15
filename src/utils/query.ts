export function queryToString(value: null | string | Array<string | number>, fallback: any = '{}'): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (!value) {
    return fallback;
  }

  return value;
}
