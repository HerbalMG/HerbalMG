import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext({
  loading: false,
  setLoading: (val) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
