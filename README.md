# graphql-workshop

## What's in this tutorial?

The goal of this tutorial is to get frontend developers up and running with GraphQL. Note that it's written using both Typescript and React Hooks, so users should have some familiarity with those tools before getting started.

The tutorial is broken into three sections:

1. [**GraphQL Queries & Mutations**](packages/lesson-1). This will get users familiar with the GraphQL Query syntax, and includes some practice using the Github API
2. [**Creating a GraphQL Client**](packages/lesson-2). Here we'll start to execute GraphQL queries on the client side to power a react app. This section doesn't use any frameworks and is meant to expose users to what's going on under the hood of tools like Apollo and Relay
3. [**Apollo**](packages/lesson-3). This lesson will introduce the most popular client-side GraphQL frameworks: [Apollo](https://www.apollographql.com/)

## Setup

Do the usual NPM dance:

```
npm install
```

Then create your Github access token (https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). This will be needed to get access to their API in the lessons. At a minimum you will need to give the token repo and user access.

Once you have your token, create a .env file at the project root, and add the token there:

```
// .env
GITHUB_TOKEN=1234faketoken
```

To run the code for a particular lesson, just run:

```sh
npm start -- lesson-{1|2|3}
```
