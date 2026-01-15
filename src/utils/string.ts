// method takes a multiple words string, and capitalizes each word
export function capitalizeWords(string: string, splitBy = ' '): string {
  if (import.meta.env.MODE !== 'production' && typeof string !== 'string') {
    throw new Error('Nexoya: capitalize(string) expects a string argument.');
  }

  return string
    ?.toLowerCase()
    ?.split(splitBy)
    ?.map((word) => word?.charAt(0).toUpperCase() + word?.slice(1))
    ?.join(' ');
}

export function generateNonce(length = 16) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function extractRoleString(input) {
  const match = input?.match(/{role:(\w+)}/);
  return match ? match[1] : null;
}
