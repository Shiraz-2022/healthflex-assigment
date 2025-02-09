import React from 'react';
import {ErrorHandlerContextProvider} from './ErrorHandlerContext';
import {ThemeProvider} from '../context/ThemeContext';

const AppProviders: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <ErrorHandlerContextProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorHandlerContextProvider>
  );
};

export default AppProviders;
