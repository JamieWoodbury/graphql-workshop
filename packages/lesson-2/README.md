# Lesson 2: Creating a GraphQL Client

In this lesson we're going to build a React app to list the top repositories for a given user on Github, using their GraphQL API.

## Introduction to GraphQL APIs

Most apps using GraphQL will use some sort of library to manage interactions with the server, but there's really no reason why you can't just execute api calls against the server directly. A GraphQL endpoint behaves just like any other endpoint, except that every operation we perform (regardless of whether it is a read or write operation) will be made as a post request containing two fields:

1. `query` which contains our GraphQL query string
2. `variables` an optional entry that contains any arguments required by the query

So, to call the Github API and fetch the currently logged in user, we would write:

```js
const query = `
{
  viewer {
    login
  }
}
`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer 123faketoken`
  },
  body: JSON.stringify({ query })
});
```

Which would return the following payload:

```json
{
  "data": {
    "viewer": {
      "login": "JamieWoodbury"
    }
  }
}
```

This is really all libraries like Apollo or Relay are doing under the hood. I don't mean to discount them, they're both fantastic tools that abstract away a lot of the complexity of state management, but there's no need to think their performing some form of magic to make GraphQL work.

## Exercises

### 1. List your most recent five repositories

Modify the query in `index.tsx` to also fetch your most recent repositories (you should be able to use a query from lesson-1), and add some markup to display them on the page. Remember, since we are using typescript you will also need to update the type definitions for the response.

<details>
  <summary>Solution</summary>

```typescript
const query = `
  query {
    viewer {
      login
      repositories(last: 5) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

type NodeList<T> = {
  nodes: T[];
};

type Response<T> = {
  data: T;
};

interface Data {
  viewer: Viewer;
}

interface Repository {
  id: string;
  name: string;
}

interface Viewer {
  login: string;
  repositories: NodeList<Repository>;
}
```

</details>

### 2. Allow users to display 5, 10, or 20 results

For this exercise you'll need to use variables in your GraphQL query. To make a request containing variables, just pass a variables object as the second argument to `gqlFetch`. e.g.

```typescript
query = `
query UserQuery($login: String!){
  user(login: $login) {
    name
    location
  }
}
`;

gqlFetch(query, { login: 'JamieWoodbury' });
```

<details>
  <summary>Solution</summary>

```typescript
const query = `
  query RootQuery($resultsPerPage: Int!) {
    viewer {
      login
      repositories(last: $resultsPerPage) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

// ...

useAsyncEffect(async () => {
  const res = await gqlFetch<Response>(query, { resultsPerPage });
  setState(res.data);
}, [resultsPerPage]);
```

</details>

### 3. [Optional] Rather than displaying _your_ repositories, allow users to search for repositories by any user given their login.

<details>
  <summary>Solution</summary>

```typescript
const query = `
  query ViewerQuery($resultsPerPage: Int!, $login: String!) {
    viewer {
      login
    }
    user(login: $login) {
      repositories(last: $resultsPerPage) {
        nodes {
          name
          id
        }
      }
    }
  }
`;

// ...

const search = async (variables: Variables, cb: (data: Data) => void) => {
  const res = await gqlFetch<Response<Data>>(query, variables);
  cb(res.data);
};

// ...

<Search onSubmit={login => search({ resultsPerPage, login }, setData)} />;
```

<details>
