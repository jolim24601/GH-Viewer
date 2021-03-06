import fetch from 'isomorphic-fetch';
import { Map, fromJS } from 'immutable';

const API_ROOT = 'https://api.github.com/';

// parse response headers from github api for pagination links
function getPageUrl(response, rel) {
  const link = response.headers.get('link');
  if (!link) return null;

  const nextLink = link.split(',').find((s) => s.indexOf(`rel="${rel}"`) > -1);
  if (!nextLink) return null;

  return nextLink.split(';')[0].trim().slice(1, -1);
}

export function callApi(endpoint) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl)
    .then((response) =>
      response.json().then((json) => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      let pageUrls = Map({
        nextPageUrl: getPageUrl(response, 'next'),
        lastPageUrl: getPageUrl(response, 'last'),
        firstPageUrl: getPageUrl(response, 'first'),
        prevPageUrl: getPageUrl(response, 'prev')
      });

      return fromJS({ json, pageUrls });
    });
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default (store) => (next) => (action) => {
  const callObj = action[CALL_API];

  if (typeof callObj === 'undefined') {
    return next(action);
  }

  let { endpoint } = callObj;
  const { types } = callObj;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every((type) => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint).then(
    (response) => next(actionWith({
      response,
      type: successType
    })),
    (error) => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};
