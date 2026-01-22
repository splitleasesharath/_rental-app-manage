import React, { useEffect } from 'react';
import { useApplicationContext } from '../context/ApplicationContext';
import {
  AlertNotification,
  SearchFilters,
  ApplicationsTable,
  ApplicationDetailView,
  EditPanel,
} from '../components';
import '../styles/RentalAppManagePage.css';

export const RentalAppManagePage: React.FC = () => {
  const { viewMode, isLoading, error } = useApplicationContext();

  // Hide Crisp chat on mobile (as per Bubble workflow)
  useEffect(() => {
    const hideCrispOnMobile = () => {
      if (window.innerWidth < 768 && typeof window !== 'undefined') {
        // @ts-ignore - Crisp global
        if (window.$crisp) {
          // @ts-ignore
          window.$crisp.push(['do', 'chat:hide']);
        }
      }
    };

    hideCrispOnMobile();
    window.addEventListener('resize', hideCrispOnMobile);

    return () => {
      window.removeEventListener('resize', hideCrispOnMobile);
    };
  }, []);

  return (
    <div className="rental-app-manage-page">
      {/* Alert Notifications */}
      <AlertNotification />

      {/* Edit Panel (Modal) */}
      <EditPanel />

      {/* Page Header */}
      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">Rental Application Management</h1>
          <p className="page-subtitle">
            Search, filter, and manage rental applications
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-main">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {viewMode === 'list' ? (
          <>
            {/* Search & Filters */}
            <SearchFilters />

            {/* Applications Table */}
            <ApplicationsTable />
          </>
        ) : (
          /* Full Application View */
          <ApplicationDetailView />
        )}
      </main>

      {/* Page Footer */}
      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Split Lease. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RentalAppManagePage;
