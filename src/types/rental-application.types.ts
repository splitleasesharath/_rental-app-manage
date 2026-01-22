// Rental Application Management Types
// Based on Bubble.io data structure for Split Lease

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  moveInDate?: Date;
  moveOutDate?: Date;
  reasonForLeaving?: string;
  landlordName?: string;
  landlordPhone?: string;
  monthlyRent?: number;
}

export interface Employment {
  id: string;
  employerName: string;
  jobTitle: string;
  employerAddress?: string;
  employerPhone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  startDate?: Date;
  endDate?: Date;
  monthlyIncome: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'self-employed' | 'unemployed' | 'retired' | 'student';
  isCurrent: boolean;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  yearsKnown?: number;
}

export interface Occupant {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  relationship: string;
  email?: string;
  phone?: string;
  isAdult: boolean;
  willBeOnLease: boolean;
}

export interface Accessibility {
  hasPets: boolean;
  petDetails?: PetDetails[];
  smokingPreference: 'non-smoking' | 'smoking-outside' | 'smoking-allowed';
  parkingRequired: boolean;
  parkingType?: 'covered' | 'uncovered' | 'garage' | 'street';
  accessibilityNeeds?: string;
  additionalRequirements?: string;
}

export interface PetDetails {
  id: string;
  type: string;
  breed?: string;
  weight?: number;
  age?: number;
  name?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  ssn?: string; // Last 4 digits only for display
  driversLicense?: string;
  driversLicenseState?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
}

export interface RentalApplication {
  id: string;
  uniqueId: string;
  status: ApplicationStatus;
  completionPercentage: number;
  isCompleted: boolean;

  // Related User (Guest/Creator)
  guest: User;
  guestId: string;

  // Application Sections
  personalInfo: PersonalInfo;
  currentAddress: Address;
  previousAddresses?: Address[];
  employment: Employment[];
  references: Reference[];
  occupants: Occupant[];
  accessibility: Accessibility;

  // Financial Information
  monthlyIncome: number;
  additionalIncome?: number;
  totalMonthlyIncome: number;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  // Background & Credit
  hasEviction: boolean;
  evictionDetails?: string;
  hasFelony: boolean;
  felonyDetails?: string;
  hasBankruptcy: boolean;
  bankruptcyDetails?: string;

  // Consent & Signatures
  backgroundCheckConsent: boolean;
  creditCheckConsent: boolean;
  termsAccepted: boolean;
  signatureDate?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}

export type ApplicationStatus =
  | 'draft'
  | 'in-progress'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'conditionally-approved'
  | 'denied'
  | 'withdrawn'
  | 'expired';

export interface ApplicationFilters {
  searchQuery?: string;
  name?: string;
  email?: string;
  uniqueId?: string;
  status?: ApplicationStatus | 'all';
  isCompleted?: boolean | 'all';
  minIncome?: number;
  maxIncome?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export type SortField =
  | 'createdAt'
  | 'updatedAt'
  | 'submittedAt'
  | 'lastName'
  | 'email'
  | 'status'
  | 'monthlyIncome';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Page State Types
export type ViewMode = 'list' | 'fullview';

export type EditSection =
  | 'none'
  | 'personal'
  | 'address'
  | 'employment'
  | 'occupants'
  | 'references'
  | 'accessibility';

export interface PageState {
  viewMode: ViewMode;
  selectedApplicationId: string | null;
  editSection: EditSection;
  isEditPanelOpen: boolean;
}

// Alert Types (for purple alert notification system)
export interface AlertConfig {
  id: string;
  title?: string;
  content: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'purple';
  duration: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  showCloseButton: boolean;
}
