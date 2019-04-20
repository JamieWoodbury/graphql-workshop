import React, { useState, Dispatch, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { useAsyncEffect, gqlFetch } from './util';
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
  const [login, setLogin] = useState<string>('');

  useAsyncEffect(async () => {
    const res = await gqlFetch<Response<Data>>(query, { resultsPerPage, login });
    setData(res.data);
  }, [resultsPerPage, '']);

  return data ? (
    <div className={styles.main}>
      <h2>
        Welcome to Github <em>{data.viewer.login}</em>!
      </h2>
      <h3>Your Repositories:</h3>

      <input
        value={login}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setLogin(e.currentTarget.value);
        }}
      />
      <button onClick={() => search({ resultsPerPage, login }, setData)}>Search</button>

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

interface PaginationProps {
  resultsPerPage: number;
  setResultsPerPage: (n: number) => void;
}

const Pagination = ({ resultsPerPage, setResultsPerPage }: PaginationProps) => (
  <div className={styles.pagination}>
    <span>Results Per Page: </span>
    {[5, 10, 20].map(n => (
      <a
        className={resultsPerPage === n ? styles.active : ''}
        href="javascript:void(0)"
        key={n}
        onClick={() => setResultsPerPage(n)}
      >
        {n}
      </a>
    ))}
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
