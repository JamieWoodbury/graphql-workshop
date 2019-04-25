import React, { useState } from 'react';
import styles from './styles.css';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { Search, Pagination } from './util';

const query = gql`
  query RepoQuery($resultsPerPage: Int!, $login: String!) {
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

interface User {
  repositories: {
    nodes: Repository[];
  };
}

interface Viewer {
  login: string;
}

interface Data {
  user: User;
  viewer: Viewer;
}

interface Variables {
  resultsPerPage: number;
  login: string;
}

interface Props {
  data: Data;
  resultsPerPage: number;
  setResultsPerPage: (n: number) => void;
  setLogin: (n: string) => void;
  login: string;
}

export const Repos = (props: Props) => {
  const { data, resultsPerPage, setResultsPerPage, setLogin, login } = props;
  return (
    <div className={styles.main}>
      <h2>
        Welcome to Github <em>{data.viewer.login}</em>!
      </h2>
      <h3>Your Repositories:</h3>
      <Search onSubmit={setLogin} search={login} />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Repo Name</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.user.repositories.nodes.map(repo => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <Pagination resultsPerPage={resultsPerPage} setResultsPerPage={setResultsPerPage} />
    </div>
  );
};

export default function App() {
  const [resultsPerPage, setResultsPerPage] = useState<number>(5);
  const [login, setLogin] = useState<string>('gaearon');

  const { data, error, loading } = useQuery<Data, Variables>(query, {
    variables: {
      resultsPerPage,
      login
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>Something when wrong.</p>;
  } else if (data) {
    return (
      <Repos
        data={data}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        setLogin={setLogin}
        login={login}
      />
    );
  } else {
    return null;
  }
}
