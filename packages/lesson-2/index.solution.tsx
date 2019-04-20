import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncEffect, gqlFetch, Search, Pagination } from './util';
import styles from './styles.css';

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

type NodeList<T> = {
  nodes: T[];
};

type Response<T> = {
  data: T;
};

interface Repository {
  id: string;
  name: string;
}

interface Viewer {
  login: string;
}

interface User {
  repositories: NodeList<Repository>;
}

interface Data {
  viewer: Viewer;
  user: User | null;
}

interface Variables {
  resultsPerPage: number;
  login: string;
}

const search = async (variables: Variables, cb: (data: Data) => void) => {
  const res = await gqlFetch<Response<Data>>(query, variables);
  cb(res.data);
};

const App = () => {
  const [data, setData] = useState<Data | null>(null);
  const [resultsPerPage, setResultsPerPage] = useState<number>(5);

  useAsyncEffect(async () => {
    const res = await gqlFetch<Response<Data>>(query, { resultsPerPage, login: '' });
    setData(res.data);
  }, [resultsPerPage]);

  return data ? (
    <div className={styles.main}>
      <h2>
        Welcome to Github <em>{data.viewer.login}</em>!
      </h2>
      <h3>Your Repositories:</h3>

      <Search onSubmit={(login: string) => search({ resultsPerPage, login }, setData)} />

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
