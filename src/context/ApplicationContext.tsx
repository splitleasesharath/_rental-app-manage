import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  RentalApplication,
  ApplicationFilters,
  SortConfig,
  PaginationConfig,
  ViewMode,
  EditSection,
  Occupant,
} from '../types';
import { rentalApplicationApi } from '../services/api';

interface ApplicationContextType {
  // Data
  applications: RentalApplication[];
  selectedApplication: RentalApplication | null;
  isLoading: boolean;
  error: string | null;

  // Pagination
  pagination: PaginationConfig;

  // Filters & Sorting
  filters: ApplicationFilters;
  sort: SortConfig;

  // View State
  viewMode: ViewMode;
  editSection: EditSection;
  isEditPanelOpen: boolean;

  // Actions
  fetchApplications: () => Promise<void>;
  selectApplication: (id: string | null) => Promise<void>;
  updateFilters: (filters: Partial<ApplicationFilters>) => void;
  clearFilters: () => void;
  updateSort: (sort: SortConfig) => void;
  toggleSortDirection: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // View Actions
  setViewMode: (mode: ViewMode) => void;
  setEditSection: (section: EditSection) => void;
  openEditPanel: (section: EditSection) => void;
  closeEditPanel: () => void;

  // CRUD Actions
  updateApplication: (id: string, updates: Partial<RentalApplication>) => Promise<boolean>;
  addOccupant: (applicationId: string, occupant: Omit<Occupant, 'id'>) => Promise<boolean>;
  deleteOccupant: (applicationId: string, occupantId: string) => Promise<boolean>;
}

const defaultFilters: ApplicationFilters = {
  isCompleted: true,
};

const defaultSort: SortConfig = {
  field: 'createdAt',
  direction: 'desc',
};

const defaultPagination: PaginationConfig = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  return context;
};

interface ApplicationProviderProps {
  children: ReactNode;
  initialApplicationId?: string;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
  initialApplicationId,
}) => {
  // Data State
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<RentalApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [pagination, setPagination] = useState<PaginationConfig>(defaultPagination);

  // Filter & Sort State
  const [filters, setFilters] = useState<ApplicationFilters>(defaultFilters);
  const [sort, setSort] = useState<SortConfig>(defaultSort);

  // View State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editSection, setEditSection] = useState<EditSection>('none');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const response = await rentalApplicationApi.getApplications(
      filters,
      sort,
      { page: pagination.page, pageSize: pagination.pageSize }
    );

    if (response.success && response.data) {
      setApplications(response.data.items);
      setPagination(response.data.pagination);
    } else {
      setError(response.error || 'Failed to fetch applications');
    }

    setIsLoading(false);
  }, [filters, sort, pagination.page, pagination.pageSize]);

  // Select application
  const selectApplication = useCallback(async (id: string | null) => {
    if (!id) {
      setSelectedApplication(null);
      setViewMode('list');
      return;
    }

    setIsLoading(true);
    const response = await rentalApplicationApi.getApplicationById(id);

    if (response.success && response.data) {
      setSelectedApplication(response.data);
      setViewMode('fullview');
    } else {
      setError(response.error || 'Failed to fetch application');
    }

    setIsLoading(false);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ApplicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: SortConfig) => {
    setSort(newSort);
  }, []);

  // Toggle sort direction
  const toggleSortDirection = useCallback(() => {
    setSort(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Pagination actions
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Edit panel actions
  const openEditPanel = useCallback((section: EditSection) => {
    setEditSection(section);
    setIsEditPanelOpen(true);
  }, []);

  const closeEditPanel = useCallback(() => {
    setEditSection('none');
    setIsEditPanelOpen(false);
  }, []);

  // CRUD Operations
  const updateApplication = useCallback(async (
    id: string,
    updates: Partial<RentalApplication>
  ): Promise<boolean> => {
    const response = await rentalApplicationApi.updateApplication(id, updates);

    if (response.success && response.data) {
      // Update in list
      setApplications(prev =>
        prev.map(app => app.id === id ? response.data! : app)
      );
      // Update selected if it's the same
      if (selectedApplication?.id === id) {
        setSelectedApplication(response.data);
      }
      return true;
    }

    setError(response.error || 'Failed to update application');
    return false;
  }, [selectedApplication]);

  const addOccupant = useCallback(async (
    applicationId: string,
    occupant: Omit<Occupant, 'id'>
  ): Promise<boolean> => {
    const response = await rentalApplicationApi.addOccupant(applicationId, occupant);

    if (response.success && response.data) {
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? response.data! : app)
      );
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(response.data);
      }
      return true;
    }

    setError(response.error || 'Failed to add occupant');
    return false;
  }, [selectedApplication]);

  const deleteOccupant = useCallback(async (
    applicationId: string,
    occupantId: string
  ): Promise<boolean> => {
    const response = await rentalApplicationApi.deleteOccupant(applicationId, occupantId);

    if (response.success && response.data) {
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? response.data! : app)
      );
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(response.data);
      }
      return true;
    }

    setError(response.error || 'Failed to delete occupant');
    return false;
  }, [selectedApplication]);

  // Initial load
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Load initial application if ID provided (from URL)
  useEffect(() => {
    if (initialApplicationId) {
      selectApplication(initialApplicationId);
    }
  }, [initialApplicationId, selectApplication]);

  const value: ApplicationContextType = {
    applications,
    selectedApplication,
    isLoading,
    error,
    pagination,
    filters,
    sort,
    viewMode,
    editSection,
    isEditPanelOpen,
    fetchApplications,
    selectApplication,
    updateFilters,
    clearFilters,
    updateSort,
    toggleSortDirection,
    setPage,
    setPageSize,
    setViewMode,
    setEditSection,
    openEditPanel,
    closeEditPanel,
    updateApplication,
    addOccupant,
    deleteOccupant,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContext;
