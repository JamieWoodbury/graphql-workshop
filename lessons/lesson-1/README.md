# Lesson 1: Queries & Mutations

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

Queries in graphql can be though of as ordinary functions and, like other functions queries, they can take in arguments. For instance, if we wanted to fetch a specific user by their login, we could just execute:

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

<details>
  <summary>a) Write a query that will return the name, description and number of forks of the https://github.com/facebook/react repository.</summary>

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

<details>
  <summary>a) Write a query that will return the name, description and owner (along with their login), of the https://github.com/facebook/react repository.</summary>

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

<details>
  <summary>b) Write a query that will return the name, description, number of forks of the https://github.com/facebook/react repository, along with the name and author (his/her name) of the last 5 releases.</summary>

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

Until now, we've only been making one query per request, but there's no reason why we couldn't add more:

```graphql
query {
  viewer {
    login
  }
  user(login: "gaearon") {
    name
    location
  }
}
```

Returning

```json
{
  "data": {
    "viewer": {
      "login": "JamieWoodbury"
    },
    "user": {
      "name": "Dan Abramov",
      "location": "London, UK"
    }
  }
}
```

This works well if we're querying two different types of nodes (`viewer`, and `user`), since the data object that gets returned will key the responses on the node type. If we want to make two queries on the same node though, we'll need to include **query aliases**, that will be used as they keys in the returned payload.

```graphql
query {
  dan: user(login: "gaearon") {
    name
    location
  }
}
```

Returning

```json
{
  "data": {
    "jamie": {
      "name": "Jamie Woodbury",
      "location": "Canada"
    },
    "dan": {
      "name": "Dan Abramov",
      "location": "London, UK"
    }
  }
}
```

Now we can now query multiple nodes of the same type in the same request. Some of you have probably already noticed though that we have some code duplication in that request. Since we're requesting the same fields on both of the user nodes, we can pull that information out into a **fragment** that gets used by both queries:

```graphql
query {
  jamie: user(login: "jamiewoodbury") {
    ...UserFragment
  }
  dan: user(login: "gaearon") {
    ...UserFragment
  }
}

fragment UserFragment on User {
  name
  location
}
```

Returning the same result

```json
{
  "data": {
    "jamie": {
      "name": "Jamie Woodbury",
      "location": "Canada"
    },
    "dan": {
      "name": "Dan Abramov",
      "location": "London, UK"
    }
  }
}
```

<details>
  <summary>a) Write a query to fetch both the viewer and the some details about the https://github.com/facebook/react repository.</summary>

```graphql
query {
  viewer {
    login
  }
  repository(owner: "facebook", name: "react") {
    name
    description
    forkCount
  }
}
```

</details>

<details>
  <summary>b) Write a query to request the names and descriptions of the react, redux and apollo-client repos</summary>

```graphql
query {
  react: repository(owner: "facebook", name: "react") {
    name
    description
  }
  redux: repository(owner: "reduxjs", name: "redux") {
    name
    description
  }
  apollo: repository(owner: "apollographql", name: "apollo-client") {
    name
    description
  }
}
```

</details>

<details>
  <summary>c) Write a query to fetch the first 5 mentionable users and the first 5 watchers of the facebook repo, along with their login, location, email and status</summary>

```graphql
query {
  repository(owner: "facebook", name: "react") {
    mentionableUsers(first: 5) {
      nodes {
        ...UserFragment
      }
    }
    watchers(first: 5) {
      nodes {
        ...UserFragment
      }
    }
  }
}

fragment UserFragment on User {
  login
  location
  email
  status {
    ...StatusFragment
  }
}

fragment StatusFragment on UserStatus {
  emoji
  message
}
```

</details>

## Exercise #5: Variables

Variables are how we can make our queries generic, and reusable. Rather than hard-coding values like user logins and repo names has we've been doing so far, these values can be declared as variables in our query, and then passed in when the query is being executed (or sent to the server along with the query when a request is made). Generalizing our user query above we can write:

```graphql
query UserQuery($login: String!) {
  user(login: $login) {
    name
    location
  }
}
```

And if we execute this query with `{"login": "jamiewoodbury"}`
we get the same result as we received before. Note that there is a panel in the GraphiQL IDE below the query where you can pass in variables.

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

<details>
  <summary>a) Write a query to fetch any repo given its owner and name</summary>

```graphql
query RepoQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
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

<details>
  <summary>b) Write a query to fetch any user and their first `n` repositories</summary>

```graphql
query UserQuery($login: String!, $n: Int!) {
  user(login: $login) {
    name
    location
    repositories(first: $n) {
      nodes {
        name
      }
    }
  }
}
```

</details>

## Exercise #6: Mutations

Up until we've focused on querying data from a GraphQL API and avoided talking about write operations. In GraphQL, these are known as `mutations`, and can be thought of as making a `POST` request. Let's start by looking at an example of a mutation where we add a new comment to a PR (using the id we would have gotten from a previous query):

```graphql
mutation AddCommentMutation {
  addComment(input: { subjectId: "MDEwOlJlcG9zaXRvcnkxODE4OTMQWER=", body: "Cool PR." }) {
    commentEdge {
      node {
        id
        bodyText
      }
    }
  }
}
```

Returning:

```json
{
  "data": {
    "addComment": {
      "commentEdge": {
        "node": {
          "id": "MDEyOklzc3VlQ29tbWVudDQ4Njg1ODASDF==",
          "bodyText": "Cool PR."
        }
      }
    }
  }
}
```

This doesn't look all that different from the queries we've been writing up until now, only that we've replaced the `query` keyword with `mutation`. Both queries and mutations declare the field they would like to access along with a set of variables, and then define the shape of the object they would like returned. The only real difference between the two is that mutations perform a side effect -- in this case saving a new comment to the database.

<details>
  <summary>a) Write a mutation to star this repository</summary>

```graphql
mutation AddStarMutation {
  addStar(input: { starrableId: "MDEwOlJlcG9zaXRvcnkxODE4OTM1NjI=" }) {
    starrable {
      id
      viewerHasStarred
    }
  }
}
```

</details>
