import { CALL_API } from '../middleware/api';
import { generateParams, updateTags } from './';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';
export const USER_MENTION = 'USER_MENTION';

const MENTION_REGEX = /\B@[a-z0-9_-]+/gi;

function fetchUser(username) {
  return {
    [CALL_API]: {
      types: [ USER_REQUEST, USER_SUCCESS, USER_FAILURE ],
      endpoint: `users/${username}${generateParams()}`
    }
  };
}

function replaceWithMentions(item, mentions) {
  return (dispatch, _getState) => {
    let user, body;
    for (let i=0; i < mentions.length; i++) {
      // ping GitHub API to check if this tag is a user
      dispatch(fetchUser(mention[i].slice(1))).then(({ response, _type }) => {
        user = response.get('json');
        if (!user) return null;

        body = body.replace(
          mention,
          `<a class=user-mention href=${user.get('html_url')}>${mention}</a>`
        );
      });
    }

    return dispatch({ type: USER_MENTION, response: item.set('body', body) });
  };
}

function findAndUpdateMentions(item) {
  return (dispatch, _getState) => {
    if (!item.get('body')) return null;
    const mentions = item.get('body').match(MENTION_REGEX);
    return mentions ? dispatch(replaceWithMentions(item, mentions)) : null;
  };
}

export function generateUserMentions(items) {
  items = items instanceof Array ? items : [items];
  // replace usernames with links in comment/issue body and dispatch an update
  return (dispatch, _getState) =>
    items.forEach((item) => dispatch(findAndUpdateMentions(item)));
}
