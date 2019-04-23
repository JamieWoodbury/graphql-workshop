# Lesson 3: Apollo

In this lesson we're going to continue where we left off from lesson-2, only using Apollo to manage our GraphQL queries.

## Introducing Apollo

Apollo[-client] is a client-side framework designed to execute GraphQL queries and manage the resulting state. You can think of it as a combination of `fetch` and `redux`, with all of the complexity abstracted away. To create a very minimal component using Apollo, we would write:

```typescript
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const query = gql`
  {
    viewer {
      login
    }
  }
`;

interface Data {
  viewer: {
    login: string;
  };
}

export default () => {
  const { data, error, loading } = useQuery<Data>(query);

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Something when wrong.</p>;
  } else if (data) {
    return <p>Hello {data.viewer.login}</p>;
  }
};
```

This looks very similar to what we were doing with `gqlFetch` in the previous lesson, but with all of the state management logic stripped away. What we're left with are three variables `data`, `loading`, and `error`. When the request first executes `loading` will be true, until the query resolves. If it resolves as a success, the component will re-render and `data` will contain the result of our query. If it errors out, `error` will contain the relevant error.

What makes Apollo powerful is that if we were to make this request again, Apollo would first check to see if the relevant nodes are contained in its cache. If it finds the relevant data, it will return that and avoid making another network call. If you've ever used other state management solutions like redux, you'll understand how much effort not having to manage this state yourself could save. Just write your query, and that's it [mostly].

## Setting up the Apollo Client

To create a new client, your first need to define a few [Apollo Links](https://www.apollographql.com/docs/link/) to point Apollo to your GraphQL api, handle Auth, and create a cache for it to store the request data. What exactly apollo links are is beyond the scope of this tutorial, but you can think of them as a kind of middleware for your graphQL reuests.

Like redux, Apollo keeps a global state inside of a React Context at the root of your application, that gets injected using the ApolloProvider.

```typescript
// Passes the auth token header along with every request
const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
}));

// Tell apollo where to find the GraphQL schema
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql'
});

// Initialize the client, telling it to cache requests in-memory
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
);
```

With that we're free to make graphQL requests from inside the `App` component using the `useQuery` and `useMutation` hooks provided by `react-apollo-hooks`.
