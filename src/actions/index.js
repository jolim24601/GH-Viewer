import queryString from 'query-string';

const GITHUB_KEY = process.env.GITHUB_KEY;

export function generateParams(query) {
  query = query ? query : {};
  query.access_token = GITHUB_KEY;
  
  return `?${queryString.stringify(query)}`;
}

export * from './comments';
export * from './error';
export * from './issues';
export * from './user';
