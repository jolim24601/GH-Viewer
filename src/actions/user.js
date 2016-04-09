import { CALL_API } from '../middleware/api';
import { generateParams, updateTags } from './';
import { List } from 'immutable';

const MENTION_REGEX = /\B@(?!.*(-){2,}.*)[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?\b/ig;

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

function updateItems(users, items) {
  return (dispatch, getState) => {
    users = users.filter((user) => user);

    // map each username to its formatted link, collect usernames to match later
    let links = {};
    let usernames = [];
    users.forEach((user) => {
      let username = `@${user.get('login')}`;
      usernames.push(username);
      links[username] = `<a class=user-mention href=${user.get('html_url')}>${username}</a>`;
    });

    // replace each issue/comment's body with links
    items = items.map((item) => {
      let body = item.get('body')
                     .replace(new RegExp(usernames.join('|'), 'gi'), (matched) => links[matched]);

      return item.set('body', body);
    });

    return dispatch({ type: USER_MENTION, response: items });
  };
}

function verifyMentions(mentions, items) {
  let users = [];
  return (dispatch, getState) => {
    for (let mention of mentions) {
      dispatch(fetchUser(mention.slice(1)))
        .then((action) => {
          if (!action.response) return null;
          return action.response.get('json');
        })
        .then((user) => {
          users.push(user);
          // after all fetches are complete, update items with mentions
          if (users.length === mentions.size) {
            return dispatch(updateItems(users, items));
          }
        });
    }
  };
}

function findMentions(item) {
  if (!item.get('body')) return null;
  // an ES6 set prevents passing the same mention more than once
  return new Set(item.get('body').match(MENTION_REGEX));
}

export function generateUserMentions(items) {
  items = items instanceof List ? items : [items];
  let mentions = new Set();

  return (dispatch, _getState) => {
    items.forEach((item) => {
      let otherMentions = findMentions(item);
      // gets the union of the two sets
      mentions = new Set([...mentions, ...otherMentions]);
    });

    return dispatch(verifyMentions(mentions, items));
  };
}
