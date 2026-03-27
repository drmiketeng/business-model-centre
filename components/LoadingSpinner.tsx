import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mb-6"></div>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">Working on it...</h2>
      <p className="text-slate-500 max-w-md">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
