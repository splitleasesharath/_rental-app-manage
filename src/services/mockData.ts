import {
  RentalApplication,
  User,
  PersonalInfo,
  Address,
  Employment,
  Reference,
  Occupant,
  Accessibility,
  ApplicationStatus,
} from '../types';

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to generate unique application ID
const generateUniqueId = () => `RA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

// Sample Users
const sampleUsers: User[] = [
  {
    id: 'user_001',
    email: 'john.smith@email.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user_002',
    email: 'sarah.johnson@email.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '(555) 234-5678',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'user_003',
    email: 'michael.williams@email.com',
    firstName: 'Michael',
    lastName: 'Williams',
    phone: '(555) 345-6789',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'user_004',
    email: 'emily.brown@email.com',
    firstName: 'Emily',
    lastName: 'Brown',
    phone: '(555) 456-7890',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05'),
  },
  {
    id: 'user_005',
    email: 'david.garcia@email.com',
    firstName: 'David',
    lastName: 'Garcia',
    phone: '(555) 567-8901',
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-12'),
  },
];

// Generate mock rental applications
const generateMockApplications = (): RentalApplication[] => {
  const statuses: ApplicationStatus[] = [
    'submitted',
    'under-review',
    'approved',
    'conditionally-approved',
    'denied',
    'in-progress',
    'draft',
  ];

  const applications: RentalApplication[] = [];

  for (let i = 0; i < 25; i++) {
    const user = sampleUsers[i % sampleUsers.length];
    const status = statuses[i % statuses.length];
    const isCompleted = !['draft', 'in-progress'].includes(status);
    const completionPercentage = isCompleted ? 100 : Math.floor(Math.random() * 80) + 10;

    const personalInfo: PersonalInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: i % 3 === 0 ? 'A' : undefined,
      dateOfBirth: new Date(1985 + (i % 20), i % 12, (i % 28) + 1),
      ssn: '***-**-' + String(1234 + i).slice(-4),
      driversLicense: `DL${100000 + i}`,
      driversLicenseState: ['CA', 'NY', 'TX', 'FL', 'WA'][i % 5],
      email: user.email,
      phone: user.phone || '(555) 000-0000',
    };

    const currentAddress: Address = {
      street: `${100 + i} Main Street`,
      unit: i % 3 === 0 ? `Apt ${i + 1}` : undefined,
      city: ['Los Angeles', 'New York', 'Houston', 'Miami', 'Seattle'][i % 5],
      state: ['CA', 'NY', 'TX', 'FL', 'WA'][i % 5],
      zipCode: String(90000 + i * 100),
      country: 'USA',
      moveInDate: new Date(2020 + (i % 4), i % 12, 1),
      monthlyRent: 1500 + i * 50,
      landlordName: `Landlord ${i + 1}`,
      landlordPhone: `(555) ${String(600 + i).padStart(3, '0')}-${String(1000 + i).slice(-4)}`,
    };

    const employment: Employment[] = [
      {
        id: generateId(),
        employerName: ['Tech Corp', 'Healthcare Inc', 'Finance LLC', 'Retail Co', 'Education Org'][i % 5],
        jobTitle: ['Software Engineer', 'Nurse', 'Accountant', 'Manager', 'Teacher'][i % 5],
        employerAddress: `${200 + i} Business Blvd, Suite ${i + 1}`,
        employerPhone: `(555) ${String(700 + i).padStart(3, '0')}-${String(2000 + i).slice(-4)}`,
        supervisorName: `Supervisor ${i + 1}`,
        startDate: new Date(2019 + (i % 5), i % 12, 1),
        monthlyIncome: 4000 + i * 200,
        employmentType: ['full-time', 'part-time', 'contract', 'self-employed'][i % 4] as Employment['employmentType'],
        isCurrent: true,
      },
    ];

    const references: Reference[] = [
      {
        id: generateId(),
        name: `Reference ${i * 2 + 1}`,
        relationship: ['Friend', 'Former Coworker', 'Family', 'Professional'][i % 4],
        phone: `(555) ${String(800 + i).padStart(3, '0')}-${String(3000 + i).slice(-4)}`,
        email: `ref${i + 1}@email.com`,
        yearsKnown: 2 + (i % 10),
      },
      {
        id: generateId(),
        name: `Reference ${i * 2 + 2}`,
        relationship: ['Friend', 'Former Coworker', 'Family', 'Professional'][(i + 1) % 4],
        phone: `(555) ${String(810 + i).padStart(3, '0')}-${String(3100 + i).slice(-4)}`,
        yearsKnown: 1 + (i % 8),
      },
    ];

    const occupants: Occupant[] = i % 2 === 0 ? [
      {
        id: generateId(),
        firstName: 'Occupant',
        lastName: `${i + 1}`,
        relationship: ['Spouse', 'Child', 'Roommate', 'Parent'][i % 4],
        dateOfBirth: new Date(1990 + (i % 30), i % 12, (i % 28) + 1),
        isAdult: i % 4 !== 1,
        willBeOnLease: i % 3 !== 0,
      },
    ] : [];

    const accessibility: Accessibility = {
      hasPets: i % 3 === 0,
      petDetails: i % 3 === 0 ? [
        {
          id: generateId(),
          type: ['Dog', 'Cat', 'Bird'][i % 3],
          breed: ['Labrador', 'Persian', 'Parrot'][i % 3],
          weight: 10 + (i % 50),
          name: `Pet ${i + 1}`,
        },
      ] : undefined,
      smokingPreference: ['non-smoking', 'smoking-outside', 'smoking-allowed'][i % 3] as Accessibility['smokingPreference'],
      parkingRequired: i % 2 === 0,
      parkingType: i % 2 === 0 ? ['covered', 'uncovered', 'garage', 'street'][i % 4] as Accessibility['parkingType'] : undefined,
    };

    const monthlyIncome = employment.reduce((sum, emp) => sum + emp.monthlyIncome, 0);
    const additionalIncome = i % 4 === 0 ? 500 : 0;

    const application: RentalApplication = {
      id: `app_${String(i + 1).padStart(3, '0')}`,
      uniqueId: generateUniqueId(),
      status,
      completionPercentage,
      isCompleted,
      guest: user,
      guestId: user.id,
      personalInfo,
      currentAddress,
      previousAddresses: i % 3 === 0 ? [{
        street: `${50 + i} Previous St`,
        city: currentAddress.city,
        state: currentAddress.state,
        zipCode: String(80000 + i * 100),
        country: 'USA',
        moveInDate: new Date(2018, i % 12, 1),
        moveOutDate: new Date(2020 + (i % 4), i % 12, 1),
        reasonForLeaving: 'Relocation',
      }] : undefined,
      employment,
      references,
      occupants,
      accessibility,
      monthlyIncome,
      additionalIncome,
      totalMonthlyIncome: monthlyIncome + additionalIncome,
      emergencyContactName: `Emergency Contact ${i + 1}`,
      emergencyContactPhone: `(555) ${String(900 + i).padStart(3, '0')}-${String(4000 + i).slice(-4)}`,
      emergencyContactRelationship: ['Parent', 'Sibling', 'Spouse', 'Friend'][i % 4],
      hasEviction: i % 10 === 0,
      evictionDetails: i % 10 === 0 ? 'Dispute resolved' : undefined,
      hasFelony: false,
      hasBankruptcy: i % 15 === 0,
      bankruptcyDetails: i % 15 === 0 ? 'Discharged 5 years ago' : undefined,
      backgroundCheckConsent: isCompleted,
      creditCheckConsent: isCompleted,
      termsAccepted: isCompleted,
      signatureDate: isCompleted ? new Date(2024, i % 12, (i % 28) + 1) : undefined,
      createdAt: new Date(2024, i % 12, (i % 28) + 1),
      updatedAt: new Date(2024, (i % 12) + 1 > 11 ? 0 : (i % 12) + 1, (i % 28) + 1),
      submittedAt: isCompleted ? new Date(2024, i % 12, (i % 28) + 2) : undefined,
    };

    applications.push(application);
  }

  return applications;
};

export const mockApplications = generateMockApplications();
export { sampleUsers };
