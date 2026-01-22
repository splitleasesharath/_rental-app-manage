import { ApplicationStatus } from '../types';

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return 'N/A';
  // Already formatted
  if (phone.includes('(')) return phone;
  // Format raw number
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatSSN = (ssn: string | undefined): string => {
  if (!ssn) return 'N/A';
  // Show only last 4 digits
  if (ssn.includes('*')) return ssn;
  return `***-**-${ssn.slice(-4)}`;
};

export const formatAddress = (address: {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
}): string => {
  const parts = [address.street];
  if (address.unit) parts.push(address.unit);
  parts.push(`${address.city}, ${address.state} ${address.zipCode}`);
  return parts.join(', ');
};

export const formatStatus = (status: ApplicationStatus): string => {
  const statusMap: Record<ApplicationStatus, string> = {
    'draft': 'Draft',
    'in-progress': 'In Progress',
    'submitted': 'Submitted',
    'under-review': 'Under Review',
    'approved': 'Approved',
    'conditionally-approved': 'Conditionally Approved',
    'denied': 'Denied',
    'withdrawn': 'Withdrawn',
    'expired': 'Expired',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: ApplicationStatus): string => {
  const colorMap: Record<ApplicationStatus, string> = {
    'draft': '#9CA3AF',
    'in-progress': '#F59E0B',
    'submitted': '#3B82F6',
    'under-review': '#8B5CF6',
    'approved': '#10B981',
    'conditionally-approved': '#06B6D4',
    'denied': '#EF4444',
    'withdrawn': '#6B7280',
    'expired': '#DC2626',
  };
  return colorMap[status] || '#9CA3AF';
};

export const getStatusBgColor = (status: ApplicationStatus): string => {
  const colorMap: Record<ApplicationStatus, string> = {
    'draft': '#F3F4F6',
    'in-progress': '#FEF3C7',
    'submitted': '#DBEAFE',
    'under-review': '#EDE9FE',
    'approved': '#D1FAE5',
    'conditionally-approved': '#CFFAFE',
    'denied': '#FEE2E2',
    'withdrawn': '#F3F4F6',
    'expired': '#FEE2E2',
  };
  return colorMap[status] || '#F3F4F6';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const calculateAge = (dateOfBirth: Date | string): number => {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};
