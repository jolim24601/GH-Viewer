# GHViewer

### Summary

Get a list of any Github project's open issues! Users can type in any project's url by :owner and :repo and see a list of open issues, as well as a helpful summary of what's inside. Click on any issue to see its comments.

### Instructions

To run this app, do an `npm install` and `npm run start`

To run the test suite for this app: `npm run test`

Adding your Github API key:

Create a .env file and add the following:

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

1. Redux-thunk middleware. Instead of actions firing off directly, they instead return chain-able thunks, delaying their execution while passing along the store's #dispatch and #getState methods.

2. A functional approach to thinking about state. Each reducer written in the reducers folder is in charge of its own subtree, and the entire state of the app is passed through these combined reducers which, instead of mutating state, creates a copy of it with its requisite changes. Redux devtools and logger middleware mean that I can view an action and its resulting state at any point in my app's history.

Some reasons I chose React:

1. It's awesome.
2. Efficient re-renders with ImmutableJS and shallow object compares using React's pure-render-mixin.
3. Re-usable components

CSS:

PostCSS. Represents CSS as an AST.

### Technical Highlights

Pagination with caching:

Inspired by [this]((http://engineering.vine.co/post/121700244802/instant-paginated-results-in-angularjs) post on pagination from Vine's engineering blog, I decided to employ a similar caching method to storing paginated data. By pre-fetching the next page asynchronously, I reduce the time required by the user to view the next list of issues. If the user decides to view a specific issue's comments and go back to the original list, no extra fetch is required. If they decide to visit the previous page, that current page's issues will be cached as the next page.

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

Linking user mentions:

Linking users mentioned with the @-notation presented some interesting challenges with regards to time complexity. When an issue detail gets loaded it dispatches an action, #loadCommentsWithMentions, which after fetching the comments, itself dispatches #generateUserMentions. Armed with a lengthy, one-line regular expression, the OP issue along with its comments are all combed for potential user mentions, which are amalgamated into a Set to avoid repeat calls to the API.

Only once all user fetches have returned positive or negative, is the #updateItems action dispatched. To avoid more than one pass through each post, I pass a regex of all usernames that were found by the API calls, and do a global replace, using a map that links that username to its anchor tag.

```
items = items.map((item) => {
  let body = item.get('body')
                 .replace(new RegExp(usernames.join('|'), 'gi'), (matched) => links[matched]);

  return item.set('body', body);
});
```  

NPM issue [3055](https://github.com/npm/npm/issues/3055), which has at the time of writing 43 comments and 27 mentions (13 unique), was reasonably performant using this process.  

### Credit

All issues and their comments' bodies are rendered using marked as the markdown parser.

Inline code and code blocks are highlighted using highlightjs.

The regular expression I used to cull usernames was culled from this stack overflow post:

[Regex: parsing GitHub usernames (JavaScript)](http://stackoverflow.com/questions/30281026/regex-parsing-github-usernames-javascript)

momentjs to render time ago in words
