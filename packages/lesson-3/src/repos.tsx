import React, { useState } from 'react';
import styles from './styles.css';
import gql from 'graphql-tag';
import { useQuery, useMutation, MutationFn } from 'react-apollo-hooks';
import { Search, Pagination } from './util';

const query = gql`
  query RepoQuery($resultsPerPage: Int!, $login: String!) {
    viewer {
      login
      location
    }
    user(login: $login) {
      repositories(last: $resultsPerPage) {
        nodes {
          name
          id
          viewerHasStarred
        }
      }
    }
  }
`;

const mutation = gql`
  mutation AddStar($starrableId: ID!) {
    addStar(input: { starrableId: $starrableId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

interface Repository {
  id: string;
  name: string;
  viewerHasStarred: boolean;
}

interface User {
  repositories: {
    nodes: Repository[];
  };
}

interface Viewer {
  login: string;
}

interface QueryData {
  user: User;
  viewer: Viewer;
}

interface QueryVariables {
  resultsPerPage: number;
  login: string;
}

interface MutationVariables {
  starrableId: string;
}

interface MutationData {
  id: string;
}

interface Props {
  data: QueryData;
  resultsPerPage: number;
  setResultsPerPage: (n: number) => void;
  setLogin: (n: string) => void;
  login: string;
  addStar: MutationFn<MutationData, MutationVariables>;
}

export const Repos = (props: Props) => {
  const { data, resultsPerPage, setResultsPerPage, setLogin, login, addStar } = props;
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
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.user.repositories.nodes.map(repo => (
              <tr key={repo.id}>
                <td>{repo.name}</td>
                <td>
                  <button
                    disabled={repo.viewerHasStarred}
                    onClick={() => addStar({ variables: { starrableId: repo.id } })}
                  >
                    Star Me!
                  </button>
                </td>
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

  const { data, error, loading } = useQuery<QueryData, QueryVariables>(query, {
    variables: {
      resultsPerPage,
      login
    }
  });

  const addStar = useMutation<MutationData, MutationVariables>(mutation);

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
        addStar={addStar}
      />
    );
  } else {
    return null;
  }
}
