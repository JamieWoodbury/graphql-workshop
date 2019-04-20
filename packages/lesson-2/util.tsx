import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from './styles.css';

export const useAsyncEffect = (fn: () => Promise<any>, deps?: any[]) => {
  return useEffect(() => {
    fn();
  }, deps);
};

export async function gqlFetch<R>(query: string, variables?: any) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  return res.json() as Promise<R>;
}

interface PaginationProps {
  resultsPerPage: number;
  setResultsPerPage: (n: number) => void;
}

export const Pagination = ({ resultsPerPage, setResultsPerPage }: PaginationProps) => (
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

interface SearchProps {
  onSubmit: (search: string) => void;
}

export const Search = ({ onSubmit }: SearchProps) => {
  const [search, setSearch] = useState<string>('');
  return (
    <>
      <input
        value={search}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearch(e.currentTarget.value);
        }}
      />
      <button onClick={() => onSubmit(search)}>Search</button>
    </>
  );
};
