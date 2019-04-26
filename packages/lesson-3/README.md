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

This looks very similar to what we were doing the raw `useEffect/fetch` calls in the previous lesson, but with all of the state management logic stripped away. What we're left with are three variables `data`, `loading`, and `error`. When the request first executes `loading` will be true, until the query resolves. If it resolves as a success, the component will re-render and `data` will contain the result of our query. If it errors out, `error` will contain the relevant error.

What makes Apollo powerful is that if we were to make this request again, Apollo would first check to see if the relevant nodes are contained in its cache. If it finds the relevant data, it will return that and avoid making another network call. If you've ever used other state management solutions like redux, you'll understand how much effort not having to manage this state yourself could save. Just write your query, and that's it [mostly].

For mutations the syntax is very similar, only that the GraphQL request isn't evaluated imediately, and we're instead passed a handler to execute the request:

```typescript
addCommentMutation = gql`
  ...
`

const [addComment, { data, error, loading }] = useMutation<Data, Variables>(addCommentMutation);

// ...

addComment({variables: {
  subjectId: "MDEwOlJlcG9zaXRvcnkxODE4OTMQWER="
  body: "Cool PR."
}})
```

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

## Apollo Cache [advanced]

The first thing to point out is that every node in our graph is assigned a globally unique base64 encoded ID. An example would be the ID of this repo `MDEwOlJlcG9zaXRvcnkxODE4OTM1NjI=`, which decodes to `010:Repository181893562`. Inside the ID is contained both the name of the type ("Repository"), and the unique ID of that type in the system ("181893562"). This means that every node that gets queried is uniquely identifiable by it's ID.

Apollo makes use of this fact and caches every node that in a flat key-value store that it uses to manage all of the state in your application. So, whenever you reference `data` from a `useQuery` call, what you're actually doing is referencing a node (or a set of nodes) from that cache. Any future requests will then be added to this same cache, updating nodes in-place if there is any overlap.

Let's take a look at an example. Say we first log into our app and request the viewer model:

```graphql
query {
  viewer {
    id
    name
    location
  }
}
```

Which returns:

```json
{
  "data": {
    "viewer": {
      "id": "MDQ6VXNlcjQwMDg0OTg=",
      "name": "Jamie Woodbury",
      "location": "Canada"
    }
  }
}
```

The resulting cache in apollo would look something like this:

```typescript
{
  "MDQ6VXNlcjQwMDg0OTg=": {
    name: "Jamie Woodbury",
    location: "Canada"
  }
}
```

Now say that I modified my profile, and sometime later made another request

```graphql
query {
  user(login: "jamiewoodbury") {
    id
    name
    location
  }
}
```

Which returns:

```json
{
  "data": {
    "user": {
      "id": "MDQ6VXNlcjQwMDg0OTg=",
      "location": "UK"
    }
  }
}
```

The resulting Apollo store would be:

```typescript
{
  "MDQ6VXNlcjQwMDg0OTg=": {
    name: "Jamie Woodbury",
    location: "UK"
  }
}
```

In this case, since the IDs of the objects returned were the same, Apollo performed a partial to the cache. This means that anything in our app that relies on the first query will get the benefit of the updated data from the second. Pretty Cool. This feature of Apollo is especially useful when it comes to performing mutations, since we can retrieve the updated model in our mutation request, and Apollo will take care of ensuring the rest of our app is aware of the change.

## Exercises

### 1. Add the ability to star any repo in the list.

For this you should be able to re-use the mutation created in lesson-1.

<details>
  <summary>Solution</summary>

This simplest solution to the problem is to create a new mutation that executes the addStar property whenever the user clicks the button:

```typescript
const mutation = gql`
  mutation AddStar($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

interface MutationVariables {
  starrableId: string;
}

interface MutationData {
  id: string;
}

// ...

const [addStar, _] = useMutation<MutationData, MutationVariables>(mutation);

// ...
<button onClick={() => addStar({ variables: { starrableId: repo.id } })}>Star Me!</button>;
```

</details>

### 2. Mark the button as disabled when the user has starred the repo.

Hint: This problem introduces some of the nuances (and power) of Apollo's caching layer. Try to see how you can use the return value of the star mutation to update the Apollo cache and the UI.

<details>
  <summary>Solution</summary>

The trick here is to add the `viewerHasStarred` field to our repository query, and to note that the `starrable` return value from the query is the same repo node that we retrieved in our query. That way, we can retrieve the `viewerHasStarred` field in the mutation result, updating the apollo cache for that repository.

```typescript
const query = gql`
  query RepoQuery($resultsPerPage: Int!, $login: String!) {
    ...
    user(login: $login) {
      repositories(last: $resultsPerPage) {
        nodes {
          ...
          viewerHasStarred
        }
      }
    }
  }
`;

// ...
<button
  disabled={repo.viewerHasStarred}
  onClick={() => addStar({ variables: { starrableId: repo.id } })}
>
  Star Me!
</button>;
```

</details>
