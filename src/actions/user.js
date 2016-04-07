import { CALL_API } from '../middleware/api';
import { generateParams, updateTags } from './';
import { List } from 'immutable';
import twitter from 'twitter-text';

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';
export const USER_MENTION = 'USER_MENTION';

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

    for (let mention of mentions) {
      dispatch(fetchUser(mention))
        .then((action) => {
          user = action.response.get('json');
          if (!user) return null;
          const link = `<a class=user-mention href=${user.get('html_url')}>@${mention}</a>`;
          body = item.get('body').replace(new RegExp(mention, 'g'), link);
        }).then(() =>
          dispatch({ type: USER_MENTION, response: item.set('body', body) })
        );
    }
  };
}

function findAndUpdateMentions(item) {
  return (dispatch, _getState) => {
    if (!item.get('body')) return null;

    const mentions = new Set(twttr.txt.extractMentions(item.get('body')));
    return mentions ? dispatch(replaceWithMentions(item, mentions)) : null;
  };
}

export function generateUserMentions(items) {
  items = items instanceof List ? items : [items];

  // replace usernames with links in comment/issue body and dispatch an update
  return (dispatch, _getState) =>
    items.forEach((item) => dispatch(findAndUpdateMentions(item)));
}
