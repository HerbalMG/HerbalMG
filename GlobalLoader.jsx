import React from 'react';
import { useLoading } from '../context/LoadingContext';

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white bg-opacity-80">
      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
      <span className="ml-3 text-gray-700 animate-pulse">Loading...</span>
    </div>
  );
};

export default GlobalLoader;
