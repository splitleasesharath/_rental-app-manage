import React from 'react';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApplicationContext } from '../context/ApplicationContext';
import { SortField } from '../types';
import {
  formatDate,
  formatCurrency,
  formatStatus,
  getStatusColor,
  getStatusBgColor,
  getInitials,
} from '../utils/formatters';
import '../styles/ApplicationsTable.css';

interface SortableHeaderProps {
  label: string;
  field: SortField;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, field }) => {
  const { sort, updateSort, toggleSortDirection } = useApplicationContext();
  const isActive = sort.field === field;

  const handleClick = () => {
    if (isActive) {
      toggleSortDirection();
    } else {
      updateSort({ field, direction: 'asc' });
    }
  };

  return (
    <th className="table-header sortable" onClick={handleClick}>
      <div className="header-content">
        <span>{label}</span>
        <div className="sort-icons">
          <ArrowUpCircle
            size={14}
            className={`sort-icon ${isActive && sort.direction === 'asc' ? 'active' : ''}`}
          />
          <ArrowDownCircle
            size={14}
            className={`sort-icon ${isActive && sort.direction === 'desc' ? 'active' : ''}`}
          />
        </div>
      </div>
    </th>
  );
};

export const ApplicationsTable: React.FC = () => {
  const {
    applications,
    isLoading,
    pagination,
    selectApplication,
    setPage,
  } = useApplicationContext();

  const handleViewApplication = (id: string) => {
    selectApplication(id);
  };

  if (isLoading) {
    return (
      <div className="applications-table-container">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="applications-table-container">
        <div className="empty-state">
          <p>No rental applications found</p>
          <span>Try adjusting your filters or search criteria</span>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-table-container">
      <div className="table-info">
        <span className="results-count">
          Showing {applications.length} of {pagination.totalItems} applications
        </span>
      </div>

      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              <th className="table-header">Applicant</th>
              <SortableHeader label="Email" field="email" />
              <th className="table-header">Unique ID</th>
              <SortableHeader label="Status" field="status" />
              <SortableHeader label="Income" field="monthlyIncome" />
              <SortableHeader label="Submitted" field="submittedAt" />
              <SortableHeader label="Created" field="createdAt" />
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="table-row">
                <td className="table-cell applicant-cell">
                  <div className="applicant-info">
                    <div className="applicant-avatar">
                      {getInitials(app.personalInfo.firstName, app.personalInfo.lastName)}
                    </div>
                    <div className="applicant-details">
                      <span className="applicant-name">
                        {app.personalInfo.firstName} {app.personalInfo.lastName}
                      </span>
                      <span className="applicant-phone">{app.personalInfo.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="table-cell email-cell">
                  {app.personalInfo.email}
                </td>
                <td className="table-cell id-cell">
                  <code className="unique-id">{app.uniqueId}</code>
                </td>
                <td className="table-cell status-cell">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusBgColor(app.status),
                      color: getStatusColor(app.status),
                    }}
                  >
                    {formatStatus(app.status)}
                  </span>
                </td>
                <td className="table-cell income-cell">
                  {formatCurrency(app.totalMonthlyIncome)}
                </td>
                <td className="table-cell date-cell">
                  {app.submittedAt ? formatDate(app.submittedAt) : '-'}
                </td>
                <td className="table-cell date-cell">
                  {formatDate(app.createdAt)}
                </td>
                <td className="table-cell actions-cell">
                  <button
                    className="view-btn"
                    onClick={() => handleViewApplication(app.id)}
                    title="View Application"
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="pagination-info">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
          </div>

          <button
            className="pagination-btn"
            onClick={() => setPage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
