import React from 'react';
import AppProvider from './src/context/AppProvider';
import MainNavigator from '@/navigation/MainNavigator';
import ErrorFallback from '@/components/global/ErrorFallback';

const App = () => {
  return (
    <AppProvider>
      <ErrorFallback />
      <MainNavigator />
    </AppProvider>
  );
};

export default App;
