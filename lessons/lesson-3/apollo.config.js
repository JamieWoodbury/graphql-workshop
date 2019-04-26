const path = require('path');
const dotenv = require('dotenv').config;
dotenv({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  client: {
    tagName: 'gql',
    service: {
      name: 'github',
      url: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    }
  }
};
