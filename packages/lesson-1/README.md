# Lesson 1: Queries

## Intro to GraphiQL

For the following exercises, we'll be using the [Github GraphQL API explorer](https://developer.github.com/v4/explorer/). This is based off of an in-browser IDE called [GraphiQL](https://github.com/graphql/graphiql) that acts as a form of interactive API docs.

As an example, say we wanted to query who the currently authenticated user is, we write our query on the left, and have it executed against the live Github API:

![Viewer Query](./assets/basic_query.png 'Viewer Query')

If we want to learn more what fields are available to query on the viewer object, we can toggle open the documentation panel by clicking on the field in our query:

![GraphiQL API Docs](./assets/docs.png 'GraphiQL API Docs')

With this in mind we can now start to do some exploring.

## Exercise #1: Basic Querying

a) Write a query to fetch your username, email, location and profile picture.

<details>
  <summary>Solution</summary>

```graphql
query {
  viewer {
    login
    email
    location
    avatarUrl
  }
}
```

</details>

## Exercise #1: Query Arguments

Queries in graphql can be though of as ordinary functions, and like Like other functions queries can take in arguments. For instance, if we wanted to fetch a specific user by their login, we could just execute:

```graphql
query {
  user(login: "jamiewoodbury") {
    name
    location
  }
}
```

And receive:

```json
{
  "data": {
    "user": {
      "name": "Jamie Woodbury",
      "location": "Canada"
    }
  }
}
```

a) Write a query that will return the name, description and number of forks of the https://github.com/facebook/react repository.

<details>
  <summary>Solution</summary>

```graphql
query {
  repository(owner: "facebook", name: "react") {
    name
    description
    forkCount
  }
}
```

</details>

## Exercise #3: Connections

Connections are the links in a GraphQL schema that allow us to traverse multiple nodes while making a query. This is one of the most powerful aspects of GraphQL, since it allows us to fetch multiple related entities in a single call. For example, if we wanted to also get the status of a given user, we could just add a field to the previous query:

```graphql
query {
  user(login: "jamiewoodbury") {
    name
    location
    status {
      emoji
      message
    }
  }
}
```

Returning

```json
{
  "data": {
    "user": {
      "name": "Jamie Woodbury",
      "location": "Canada",
      "status": {
        "emoji": ":writing_hand:",
        "message": "Writing GraphQL Tutorials"
      }
    }
  }
}
```

Connection fields can be thought of as just another query, and like queries they can take arguments. Here we fetch the most recent two repositories associated with a given user:

```graphql
query {
  user(login: "jamiewoodbury") {
    name
    location
    repositories(first: 2, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        name
      }
    }
  }
}
```

Which returns:

```graphql
{
  "data": {
    "user": {
      "name": "Jamie Woodbury",
      "location": "Canada",
      "repositories": {
        "nodes": [
          {
            "name": "graphql-workshop"
          },
          {
            "name": "jira-analysis"
          }
        ]
      }
    }
  }
}
```

One thing to note here is that the actual nodes that we're fetching are nested on another field called `nodes`. This has to do allowing enabling pagination, which we'll discuss in a later lesson.

a) Write a query that will return the name, description and owner (along with their login), of the https://github.com/facebook/react repository.

<details>
  <summary>Solution</summary>

```graphql
query {
  repository(owner: "facebook", name: "react") {
    name
    description
    forkCount
    owner {
      login
    }
  }
}
```

</details>

b) Write a query that will return the name, description, number of forks of the https://github.com/facebook/react repository, along with the name and author (his/her name) of the last 5 releases.

<details>
  <summary>Solution</summary>

```graphql
query {
  repository(owner: "facebook", name: "react") {
    name
    description
    forkCount
    releases(last: 5) {
      nodes {
        name
        author {
          name
        }
      }
    }
  }
}
```

</details>

## Exercise #4: Combined Queries, Aliases and Fragments

<details>
  <summary>Solution</summary>

```graphql
query {
  viewer {
    login
  }
}
```

</details>

## Exercise #5: Variables

<details>
  <summary>Solution</summary>

```graphql

```

</details>

## Exercise #6 Directives

<details>
  <summary>Solution</summary>

```graphql

```

</details>
