import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncEffect, gqlFetch, Search, Pagination } from './util';
import styles from './styles.css';

const query = `
{
  viewer {
    login
  }
}
`;

type Response<T> = {
  data: T;
};

interface Viewer {
  login: string;
}

interface Data {
  viewer: Viewer;
}

const App = () => {
  const [data, setData] = useState<Data | null>(null);
  const [resultsPerPage, setResultsPerPage] = useState<number>(5);

  useAsyncEffect(async () => {
    const res = await gqlFetch<Response<Data>>(query);
    setData(res.data);
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
