import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertConfig } from '../types';

interface AlertContextType {
  alerts: AlertConfig[];
  showAlert: (config: Omit<AlertConfig, 'id'>) => void;
  showPurpleAlert: (title: string, content: string) => void;
  dismissAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);

  const showAlert = useCallback((config: Omit<AlertConfig, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newAlert: AlertConfig = { ...config, id };

    setAlerts(prev => {
      // Limit to 5 notifications max
      const updated = [...prev, newAlert];
      return updated.slice(-5);
    });

    // Auto-dismiss after duration
    if (config.duration > 0) {
      setTimeout(() => {
        dismissAlert(id);
      }, config.duration);
    }
  }, []);

  // Purple alert - matches the Bubble AirAlert configuration
  const showPurpleAlert = useCallback((title: string, content: string) => {
    showAlert({
      title,
      content,
      type: 'purple',
      duration: 5000,
      position: 'top-right',
      showCloseButton: true,
    });
  }, [showAlert]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, showPurpleAlert, dismissAlert, clearAllAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
