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
{
  viewer {
    login
  }
}
`;

interface Viewer {
  login: string;
}

interface Data {
  viewer: Viewer;
}

const App = () => {
  const [data, setData] = useState<Data | null>(null);
  const [resultsPerPage, setResultsPerPage] = useState<number>(5);

  useEffect(() => {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(res => setData(res.data));
  }, []);

  return data ? (
    <div className={styles.main}>
      <h2>
        Welcome to Github <em>{data.viewer.login}</em>!
      </h2>
      <h3>Your Repositories:</h3>

      <Search onSubmit={search => null} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Repo Name</th>
          </tr>
        </thead>
        {/* Add the list of repositories here */}
        <tbody />
      </table>
      <Pagination resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
