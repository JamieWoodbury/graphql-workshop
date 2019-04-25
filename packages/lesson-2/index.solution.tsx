import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Pagination } from './util';
import styles from './styles.css';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
};

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

interface Repository {
  id: string;
  name: string;
}

interface Viewer {
  login: string;
}

interface User {
  repositories: {
    nodes: Repository[];
  };
}

interface Data {
  viewer: Viewer;
  user: User | null;
}

const App = () => {
  const [data, setData] = useState<Data | null>(null);
  const [resultsPerPage, setResultsPerPage] = useState<number>(5);
  const [login, setLogin] = useState<string>('');

  useEffect(() => {
    const variables = { resultsPerPage, login };
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    })
      .then(res => res.json())
      .then(res => setData(res.data));
  }, [resultsPerPage, login]);

  return data ? (
    <div className={styles.main}>
      <h2>
        Welcome to Github <em>{data.viewer.login}</em>!
      </h2>
      <h3>Your Repositories:</h3>

      <Search onSubmit={setLogin} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Repo Name</th>
          </tr>
        </thead>
        <tbody>
          {data.user &&
            data.user.repositories.nodes.map(repo => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
