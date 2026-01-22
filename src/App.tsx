import React from 'react';
import { AlertProvider } from './context/AlertContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { RentalAppManagePage } from './pages/RentalAppManagePage';
import { useUrlParams } from './hooks/useUrlParams';
import './styles/index.css';

const AppContent: React.FC = () => {
  const { applicationId } = useUrlParams();

  return (
    <ApplicationProvider initialApplicationId={applicationId || undefined}>
      <RentalAppManagePage />
    </ApplicationProvider>
  );
};

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AppContent />
    </AlertProvider>
  );
};

export default App;
