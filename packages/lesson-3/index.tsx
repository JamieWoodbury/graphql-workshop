import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo-hooks';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import ApolloClient from 'apollo-client';
import App from './repos';

/* Apollo Setup */

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
