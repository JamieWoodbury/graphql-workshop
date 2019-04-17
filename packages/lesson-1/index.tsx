import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const gqlFetch = (query: string) =>
  fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({ query })
  }).then(r => r.json());

const query = `
  {
    user(id: 5) {
      firstName
      lastName
    }
  }
`;

export interface Props {}

const App = (props: Props) => {
  useEffect(() => {
    gqlFetch(query);
  }, []);
  return <div>Test</div>;
};

ReactDOM.render(<App />, document.getElementById('app'));
