import {
  RentalApplication,
  Occupant,
  ApplicationFilters,
  SortConfig,
  PaginationConfig,
} from '../types';
import { mockApplications } from './mockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store (simulates database)
let applications = [...mockApplications];

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationConfig;
}

// Rental Application API Service
export const rentalApplicationApi = {
  // GET all applications with filtering, sorting, and pagination
  async getApplications(
    filters?: ApplicationFilters,
    sort?: SortConfig,
    pagination?: { page: number; pageSize: number }
  ): Promise<ApiResponse<PaginatedResponse<RentalApplication>>> {
    await delay(300); // Simulate network delay

    try {
      let result = [...applications];

      // Apply filters
      if (filters) {
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          result = result.filter(app =>
            app.personalInfo.firstName.toLowerCase().includes(query) ||
            app.personalInfo.lastName.toLowerCase().includes(query) ||
            app.personalInfo.email.toLowerCase().includes(query) ||
            app.uniqueId.toLowerCase().includes(query)
          );
        }

        if (filters.name) {
          const nameQuery = filters.name.toLowerCase();
          result = result.filter(app =>
            app.personalInfo.firstName.toLowerCase().includes(nameQuery) ||
            app.personalInfo.lastName.toLowerCase().includes(nameQuery)
          );
        }

        if (filters.email) {
          result = result.filter(app =>
            app.personalInfo.email.toLowerCase().includes(filters.email!.toLowerCase())
          );
        }

        if (filters.uniqueId) {
          result = result.filter(app =>
            app.uniqueId.toLowerCase().includes(filters.uniqueId!.toLowerCase())
          );
        }

        if (filters.status && filters.status !== 'all') {
          result = result.filter(app => app.status === filters.status);
        }

        if (filters.isCompleted !== undefined && filters.isCompleted !== 'all') {
          result = result.filter(app => app.isCompleted === filters.isCompleted);
        }

        if (filters.minIncome !== undefined) {
          result = result.filter(app => app.totalMonthlyIncome >= filters.minIncome!);
        }

        if (filters.maxIncome !== undefined) {
          result = result.filter(app => app.totalMonthlyIncome <= filters.maxIncome!);
        }

        if (filters.dateFrom) {
          result = result.filter(app => app.createdAt >= filters.dateFrom!);
        }

        if (filters.dateTo) {
          result = result.filter(app => app.createdAt <= filters.dateTo!);
        }
      }

      // Apply sorting
      if (sort) {
        result.sort((a, b) => {
          let comparison = 0;

          switch (sort.field) {
            case 'createdAt':
              comparison = a.createdAt.getTime() - b.createdAt.getTime();
              break;
            case 'updatedAt':
              comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
              break;
            case 'submittedAt':
              comparison = (a.submittedAt?.getTime() || 0) - (b.submittedAt?.getTime() || 0);
              break;
            case 'lastName':
              comparison = a.personalInfo.lastName.localeCompare(b.personalInfo.lastName);
              break;
            case 'email':
              comparison = a.personalInfo.email.localeCompare(b.personalInfo.email);
              break;
            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;
            case 'monthlyIncome':
              comparison = a.totalMonthlyIncome - b.totalMonthlyIncome;
              break;
          }

          return sort.direction === 'asc' ? comparison : -comparison;
        });
      }

      // Apply pagination
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const totalItems = result.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const startIndex = (page - 1) * pageSize;
      const paginatedItems = result.slice(startIndex, startIndex + pageSize);

      return {
        success: true,
        data: {
          items: paginatedItems,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch applications',
      };
    }
  },

  // GET single application by ID
  async getApplicationById(id: string): Promise<ApiResponse<RentalApplication>> {
    await delay(200);

    try {
      const application = applications.find(app => app.id === id || app.uniqueId === id);

      if (!application) {
        return {
          success: false,
          error: 'Application not found',
        };
      }

      return {
        success: true,
        data: application,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch application',
      };
    }
  },

  // UPDATE application
  async updateApplication(
    id: string,
    updates: Partial<RentalApplication>
  ): Promise<ApiResponse<RentalApplication>> {
    await delay(300);

    try {
      const index = applications.findIndex(app => app.id === id);

      if (index === -1) {
        return {
          success: false,
          error: 'Application not found',
        };
      }

      applications[index] = {
        ...applications[index],
        ...updates,
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: applications[index],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update application',
      };
    }
  },

  // ADD occupant to application
  async addOccupant(
    applicationId: string,
    occupant: Omit<Occupant, 'id'>
  ): Promise<ApiResponse<RentalApplication>> {
    await delay(300);

    try {
      const index = applications.findIndex(app => app.id === applicationId);

      if (index === -1) {
        return {
          success: false,
          error: 'Application not found',
        };
      }

      const newOccupant: Occupant = {
        ...occupant,
        id: Math.random().toString(36).substring(2, 15),
      };

      applications[index] = {
        ...applications[index],
        occupants: [...applications[index].occupants, newOccupant],
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: applications[index],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add occupant',
      };
    }
  },

  // DELETE occupant from application
  async deleteOccupant(
    applicationId: string,
    occupantId: string
  ): Promise<ApiResponse<RentalApplication>> {
    await delay(300);

    try {
      const index = applications.findIndex(app => app.id === applicationId);

      if (index === -1) {
        return {
          success: false,
          error: 'Application not found',
        };
      }

      applications[index] = {
        ...applications[index],
        occupants: applications[index].occupants.filter(occ => occ.id !== occupantId),
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: applications[index],
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete occupant',
      };
    }
  },

  // UPDATE application status
  async updateStatus(
    id: string,
    status: RentalApplication['status']
  ): Promise<ApiResponse<RentalApplication>> {
    return this.updateApplication(id, { status });
  },
};

export default rentalApplicationApi;
