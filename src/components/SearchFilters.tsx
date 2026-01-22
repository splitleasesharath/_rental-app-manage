import React, { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { useApplicationContext } from '../context/ApplicationContext';
import { ApplicationStatus } from '../types';
import '../styles/SearchFilters.css';

const statusOptions: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'conditionally-approved', label: 'Conditionally Approved' },
  { value: 'denied', label: 'Denied' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'expired', label: 'Expired' },
];

const completionOptions = [
  { value: 'all', label: 'All Applications' },
  { value: 'true', label: 'Completed Only' },
  { value: 'false', label: 'Incomplete Only' },
];

export const SearchFilters: React.FC = () => {
  const { filters, updateFilters, clearFilters } = useApplicationContext();

  const [localFilters, setLocalFilters] = useState({
    name: filters.name || '',
    email: filters.email || '',
    uniqueId: filters.uniqueId || '',
    status: filters.status || 'all',
    isCompleted: filters.isCompleted === undefined ? 'all' : String(filters.isCompleted),
    minIncome: filters.minIncome?.toString() || '',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const newFilters: typeof filters = {};

      if (localFilters.name) newFilters.name = localFilters.name;
      if (localFilters.email) newFilters.email = localFilters.email;
      if (localFilters.uniqueId) newFilters.uniqueId = localFilters.uniqueId;
      if (localFilters.status !== 'all') newFilters.status = localFilters.status as ApplicationStatus;
      if (localFilters.isCompleted !== 'all') {
        newFilters.isCompleted = localFilters.isCompleted === 'true';
      }
      if (localFilters.minIncome) {
        newFilters.minIncome = parseInt(localFilters.minIncome, 10);
      }

      updateFilters(newFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters, updateFilters]);

  const handleInputChange = (field: keyof typeof localFilters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearField = (field: keyof typeof localFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: field === 'status' || field === 'isCompleted' ? 'all' : '',
    }));
  };

  const handleClearAll = () => {
    setLocalFilters({
      name: '',
      email: '',
      uniqueId: '',
      status: 'all',
      isCompleted: 'all',
      minIncome: '',
    });
    clearFilters();
  };

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => {
    if (key === 'status' || key === 'isCompleted') return value !== 'all';
    return value !== '';
  });

  return (
    <div className="search-filters">
      <div className="search-filters-header">
        <h3 className="search-filters-title">
          <Filter size={18} />
          Search & Filter
        </h3>
        <button
          className="expand-filters-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            size={18}
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
          />
        </button>
      </div>

      <div className={`search-filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Row 1: Name, Email, Unique ID */}
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Name</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name..."
                value={localFilters.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {localFilters.name && (
                <button
                  className="clear-input-btn"
                  onClick={() => handleClearField('name')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Email</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="filter-input"
                placeholder="Search by email..."
                value={localFilters.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {localFilters.email && (
                <button
                  className="clear-input-btn"
                  onClick={() => handleClearField('email')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Unique ID</label>
            <div className="input-with-icon">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="filter-input"
                placeholder="Search by ID..."
                value={localFilters.uniqueId}
                onChange={(e) => handleInputChange('uniqueId', e.target.value)}
              />
              {localFilters.uniqueId && (
                <button
                  className="clear-input-btn"
                  onClick={() => handleClearField('uniqueId')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Status, Completion, Min Income */}
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={localFilters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Completion</label>
            <select
              className="filter-select"
              value={localFilters.isCompleted}
              onChange={(e) => handleInputChange('isCompleted', e.target.value)}
            >
              {completionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Min. Monthly Income</label>
            <div className="input-with-icon">
              <span className="input-prefix">$</span>
              <input
                type="number"
                className="filter-input with-prefix"
                placeholder="0"
                value={localFilters.minIncome}
                onChange={(e) => handleInputChange('minIncome', e.target.value)}
              />
              {localFilters.minIncome && (
                <button
                  className="clear-input-btn"
                  onClick={() => handleClearField('minIncome')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <div className="filter-actions">
            <button className="clear-all-btn" onClick={handleClearAll}>
              <X size={16} />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
