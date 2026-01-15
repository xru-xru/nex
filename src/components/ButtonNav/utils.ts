import { Location, Match } from 'react-router-dom';
import 'react-router-dom';

export function pathIncludes(
  string: string,
  allowDefault = true
): (match: Match, location: Location) => boolean {
  return (match, location) => {
    const isMatch = allowDefault ? !!match : false;
    return isMatch || location.pathname.includes(string);
  };
}
