import React, {createContext, useCallback, useContext, useState} from 'react';
// import * as Sentry from "@sentry/react";

interface ErrorContextType {
  error: Error | null;
  setError: (error: Error) => void;
  clearError: () => void;
}

const ErrorHandlerContext = createContext<ErrorContextType | undefined>(
  undefined,
);

export const ErrorHandlerContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const [error, setErrorState] = useState<Error | null>(null);

  const setError = useCallback((err: Error) => {
    setErrorState(err);
    // Capture the error with Sentry
    // Sentry.captureException(error);
  }, []);

  /**
   * Clears the current error.
   */
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return (
    <ErrorHandlerContext.Provider value={{error, setError, clearError}}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

/**
 * Custom hook to use the error handler context.
 * @returns {ErrorContextType} - The error context value.
 * @throws {Error} - If the hook is used outside of an ErrorProvider.
 */
export const useErrorHandler = (): ErrorContextType => {
  const context = useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
