# graphql-workshop

## Setup

Do the usual NPM dance:

```
npm install
```

Then create your Github access token (https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). This will be needed to get access to their API in the lessons. At a minimum you will need to give the token repo access.

Once you have your token, add it to your create a config.json file at the project root, and add the token there:

```json
// config.json
{
  "githubToken": "myawesometoken"
}
```
