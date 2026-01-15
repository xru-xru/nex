import queryString from 'query-string';

const PARAM_NAME = 'presenter_mode';
export function isPresenterMode(): boolean {
  const query = queryString.parse(window.location.search);
  if (query[PARAM_NAME] && query[PARAM_NAME] === 'true') return true;
  return false;
}
