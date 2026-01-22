import React from 'react';
import { X } from 'lucide-react';
import { useAlert } from '../context/AlertContext';
import '../styles/AlertNotification.css';

export const AlertNotification: React.FC = () => {
  const { alerts, dismissAlert } = useAlert();

  if (alerts.length === 0) return null;

  const getPositionClass = (position: string): string => {
    const positionMap: Record<string, string> = {
      'top-right': 'alert-container-top-right',
      'top-left': 'alert-container-top-left',
      'top-center': 'alert-container-top-center',
      'bottom-right': 'alert-container-bottom-right',
      'bottom-left': 'alert-container-bottom-left',
      'bottom-center': 'alert-container-bottom-center',
    };
    return positionMap[position] || 'alert-container-top-right';
  };

  const getTypeClass = (type: string): string => {
    const typeMap: Record<string, string> = {
      'purple': 'alert-purple',
      'success': 'alert-success',
      'error': 'alert-error',
      'warning': 'alert-warning',
      'info': 'alert-info',
    };
    return typeMap[type] || 'alert-info';
  };

  // Group alerts by position
  const alertsByPosition = alerts.reduce((acc, alert) => {
    const position = alert.position || 'top-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(alert);
    return acc;
  }, {} as Record<string, typeof alerts>);

  return (
    <>
      {Object.entries(alertsByPosition).map(([position, positionAlerts]) => (
        <div key={position} className={`alert-container ${getPositionClass(position)}`}>
          {positionAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-notification ${getTypeClass(alert.type)}`}
            >
              <div className="alert-content">
                {alert.title && <div className="alert-title">{alert.title}</div>}
                <div className="alert-message">{alert.content}</div>
              </div>
              {alert.showCloseButton && (
                <button
                  className="alert-close-btn"
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Close notification"
                >
                  <X size={16} />
                </button>
              )}
              <div className="alert-progress-bar" />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default AlertNotification;
