# GH Viewer

### Summary

Get a list of any Github project's open issues! Users can type in any project's url by :owner and :repo and see a list of open issues, as well as a helpful summary of what's inside. Click on any issue to see its comments.

### Instructions

To run this app in development, do a `npm install` and `npm run start`. The localhost port is configured to run on port 3000.

To run the test suite for this app: `npm run test`

Open/create .env to add your API key:

```
module.exports = {
  GITHUB_KEY: <KEY>
}
```

### Detail

This app is built on top of React and Redux.

Container components, or 'smart' components, connect to the store, or state tree, and then pass them down as props to presentational, or 'dumb' components who know nothing about Redux or any store.

Technically, container components themselves are dumb components who are also passed state as a prop, using the #mapStateToProps function. They are additionally passed action creators, which get bound to the #dispatch action. Whenever these actions are triggered, the reducers are all made aware by the dispatcher, and handle the action according to its type and payload.


### Philosophical choices

Some reasons I chose Redux:

1. A functional approach to thinking about state. Each reducer written in the reducers folder is in charge of its own subtree, and the entire state of the app is passed through these combined reducers which, instead of mutating state, creates a copy of it with its requisite changes. Redux devtools and logger middleware mean that I can view an action and its resulting state at any point in my app's history.

2. Redux-thunk middleware. Instead of actions firing off directly, they instead return chain-able thunks, delaying their execution while passing along the store's #dispatch and #getState methods.


Some reasons I chose React:

1. Efficient re-renders with ImmutableJS + shallow object compares using React's pure-render-mixin.
2. Re-usable components with declared prop types to keep code DRY and easy to read.
3. It's awesome!

PostCSS:

Represents CSS as an AST, creating a programmable interface for plugins like autoprefixer.

### Technical Highlights

*Pagination with caching:*

Inspired by [this](http://engineering.vine.co/post/121700244802/instant-paginated-results-in-angularjs) post on pagination from Vine's engineering blog, I decided to employ a similar caching method to storing paginated data. By pre-fetching the next page asynchronously, I reduce the time required by the user to view the next list of issues. If the user decides to view a specific issue's comments and go back to the original list, no extra fetch is required. If they decide to visit the previous page, that current page's issues will be cached as the next page.

```
// issues are in cache
if (lastPage === page && sameRepo) return null;
// if user is going to prev page cache current page issues as next page
if (lastPage === page + 1 && sameRepo) dispatch(cacheCurrentAsNext);
// if user is going to next page get it from cache
if (lastPage === page - 1 && sameRepo) {
  dispatch(loadNextIssues);
} else {
  dispatch(fetchIssuesByRepo(owner, repo, query)).then((_action) => {
    // fetch and cache the next page
    if (lastPage !== page + 1 || !sameRepo) dispatch(fetchIfNextPage);
  });
}
```

*Linking user mentions:*

Linking users mentioned with the @-notation presented some interesting challenges with regards to time complexity. When an issue detail gets loaded it dispatches an action, #loadCommentsWithMentions, which after fetching the comments, itself dispatches #generateUserMentions. Armed with a lengthy, one-line regular expression, the OP issue along with its comments are all combed for potential user mentions, which are amalgamated into a Set to avoid repeat calls to the API.

Only once all user fetches have returned positive or negative, is the #updateItems action dispatched. To avoid more than one pass through each post, I pass a regex of all usernames that were found by the API calls, and do a global replace, using a map that links that username to its anchor tag.

```
items = items.map((item) => {
  let body = item.get('body')
                 .replace(new RegExp(usernames.join('|'), 'gi'), (matched) => links[matched]);

  return item.set('body', body);
});
```  

NPM issue [3055](https://github.com/npm/npm/issues/3055), which has-at the time of writing-43 comments and 27 mentions (13 unique)-was reasonably performant using this process.  


### Technical Debt

1. My initial inclination was to use marked's custom renderer to only parse certain elements for username mentions, primarily
because of the result of false positives in code blocks like in the case of NPM issue [12194](https://github.com/npm/npm/issues/12194).

  It would require sophisticated detection of non eligible blocks of text, since an invalid block like one that is between `<code>` tags can concurrently occupy an eligible block such as one that is between `<p>` tags.

2. A second piece of technical debt was the handling of new page queries in the componentWillReceiveProps lifecycle event in IssuesList. It would be more in line with React philosophy to have a less declarative form of handling router updates, however abstracting the issue of new page queries outside the scope of the component for a project of limited scope appeared to obfuscate rather than clarify what the code was doing. It appeared to me like a premature optimization and so I kept the code as is.

### Credit

- [marked](https://github.com/chjj/marked)
- [highlight.js](https://github.com/isagalaev/highlight.js/)
- [moment](https://github.com/moment/moment)
- [immutable-js](https://github.com/facebook/immutable-js)

The regular expression I used to parse usernames was culled from this stack overflow post:

- [Regex: parsing GitHub usernames (JavaScript)](http://stackoverflow.com/questions/30281026/regex-parsing-github-usernames-javascript)

The structure for this app was largely inspired by the examples in the official Redux repository. In particular I ported the code for the redux middleware API for use with ImmutableJS by using the 'real-world' example:

- [Redux examples](https://github.com/reactjs/redux/tree/master/examples)
