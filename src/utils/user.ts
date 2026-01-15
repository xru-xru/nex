import { capitalize } from 'lodash';

// Helper to get the first letter of a string;
export function initial(string?: string | null): string {
  return string ? string.substr(0, 1) : '';
}
// Used for avatar initials in case there is no avatar image
export function userInitials(user: { email?: string; firstname?: string; lastname?: string }): string {
  const email = user?.email || '';
  const firstname = user?.firstname || '';
  const lastname = user?.lastname || '';
  return firstname ? initial(firstname) + initial(lastname) : initial(email);
}
// Get the full name of a user or show email if no name is provided
export function userName(
  user: { email?: string; firstname?: string; lastname?: string },
  {
    abbreviate = false,
  }: {
    abbreviate: boolean;
  } = { abbreviate: false }
): string {
  const { email, firstname, lastname } = user || {};
  let nextLastname = lastname || '';

  if (nextLastname && abbreviate) {
    nextLastname = `${capitalize(nextLastname.substr(0, 1))}.`;
  }

  return firstname ? `${capitalize(firstname)} ${nextLastname}` : email;
}
