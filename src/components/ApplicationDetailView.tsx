import React from 'react';
import {
  ArrowLeft,
  User,
  MapPin,
  Briefcase,
  Users,
  FileText,
  Accessibility,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Edit,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApplicationContext } from '../context/ApplicationContext';
import {
  formatDate,
  formatCurrency,
  formatPhone,
  formatAddress,
  formatStatus,
  getStatusColor,
  getStatusBgColor,
  calculateAge,
} from '../utils/formatters';
import '../styles/ApplicationDetailView.css';

export const ApplicationDetailView: React.FC = () => {
  const {
    selectedApplication,
    selectApplication,
    openEditPanel,
  } = useApplicationContext();

  if (!selectedApplication) {
    return (
      <div className="detail-view-container">
        <div className="empty-detail">
          <p>No application selected</p>
        </div>
      </div>
    );
  }

  const app = selectedApplication;

  const handleGoBack = () => {
    selectApplication(null);
  };

  return (
    <div className="detail-view-container">
      {/* Header */}
      <div className="detail-header">
        <button className="go-back-btn" onClick={handleGoBack}>
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className="detail-title-section">
          <h2 className="detail-title">
            {app.personalInfo.firstName} {app.personalInfo.lastName}'s Application
          </h2>
          <div className="detail-meta">
            <code className="detail-id">{app.uniqueId}</code>
            <span
              className="status-badge large"
              style={{
                backgroundColor: getStatusBgColor(app.status),
                color: getStatusColor(app.status),
              }}
            >
              {formatStatus(app.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Personal Information Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <User size={20} />
              <h3>Personal Information</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('personal')}
            >
              <Edit size={14} />
              Edit personal
            </button>
          </div>
          <div className="section-content grid-2">
            <div className="info-group">
              <label>Full Name</label>
              <span>
                {app.personalInfo.firstName} {app.personalInfo.middleName || ''} {app.personalInfo.lastName}
              </span>
            </div>
            <div className="info-group">
              <label>Date of Birth</label>
              <span>
                {formatDate(app.personalInfo.dateOfBirth)} (Age: {calculateAge(app.personalInfo.dateOfBirth)})
              </span>
            </div>
            <div className="info-group">
              <label>Email</label>
              <span className="with-icon">
                <Mail size={14} />
                {app.personalInfo.email}
              </span>
            </div>
            <div className="info-group">
              <label>Phone</label>
              <span className="with-icon">
                <Phone size={14} />
                {formatPhone(app.personalInfo.phone)}
              </span>
            </div>
            <div className="info-group">
              <label>SSN (Last 4)</label>
              <span>{app.personalInfo.ssn || 'Not provided'}</span>
            </div>
            <div className="info-group">
              <label>Driver's License</label>
              <span>
                {app.personalInfo.driversLicense || 'Not provided'}
                {app.personalInfo.driversLicenseState && ` (${app.personalInfo.driversLicenseState})`}
              </span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <MapPin size={20} />
              <h3>Current Address</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('address')}
            >
              <Edit size={14} />
              Edit address
            </button>
          </div>
          <div className="section-content grid-2">
            <div className="info-group full-width">
              <label>Address</label>
              <span>{formatAddress(app.currentAddress)}</span>
            </div>
            <div className="info-group">
              <label>Move-in Date</label>
              <span>{formatDate(app.currentAddress.moveInDate)}</span>
            </div>
            <div className="info-group">
              <label>Monthly Rent</label>
              <span>{formatCurrency(app.currentAddress.monthlyRent)}</span>
            </div>
            <div className="info-group">
              <label>Landlord Name</label>
              <span>{app.currentAddress.landlordName || 'Not provided'}</span>
            </div>
            <div className="info-group">
              <label>Landlord Phone</label>
              <span>{formatPhone(app.currentAddress.landlordPhone)}</span>
            </div>
          </div>
        </div>

        {/* Employment Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <Briefcase size={20} />
              <h3>Employment</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('employment')}
            >
              <Edit size={14} />
              Edit employee
            </button>
          </div>
          <div className="section-content">
            {app.employment.map((emp, index) => (
              <div key={emp.id} className="employment-card">
                <div className="employment-header">
                  <h4>{emp.employerName}</h4>
                  {emp.isCurrent && <span className="current-badge">Current</span>}
                </div>
                <div className="grid-2">
                  <div className="info-group">
                    <label>Position</label>
                    <span>{emp.jobTitle}</span>
                  </div>
                  <div className="info-group">
                    <label>Type</label>
                    <span className="capitalize">{emp.employmentType.replace('-', ' ')}</span>
                  </div>
                  <div className="info-group">
                    <label>Monthly Income</label>
                    <span className="income">{formatCurrency(emp.monthlyIncome)}</span>
                  </div>
                  <div className="info-group">
                    <label>Start Date</label>
                    <span>{formatDate(emp.startDate)}</span>
                  </div>
                  <div className="info-group">
                    <label>Supervisor</label>
                    <span>{emp.supervisorName || 'Not provided'}</span>
                  </div>
                  <div className="info-group">
                    <label>Employer Phone</label>
                    <span>{formatPhone(emp.employerPhone)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="income-summary">
              <div className="income-row">
                <span>Monthly Employment Income</span>
                <span>{formatCurrency(app.monthlyIncome)}</span>
              </div>
              {app.additionalIncome && app.additionalIncome > 0 && (
                <div className="income-row">
                  <span>Additional Income</span>
                  <span>{formatCurrency(app.additionalIncome)}</span>
                </div>
              )}
              <div className="income-row total">
                <span>Total Monthly Income</span>
                <span>{formatCurrency(app.totalMonthlyIncome)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Occupants Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <Users size={20} />
              <h3>Additional Occupants</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('occupants')}
            >
              <Edit size={14} />
              Edit occupants
            </button>
          </div>
          <div className="section-content">
            {app.occupants.length === 0 ? (
              <p className="no-data">No additional occupants listed</p>
            ) : (
              <div className="occupants-list">
                {app.occupants.map((occupant) => (
                  <div key={occupant.id} className="occupant-card">
                    <div className="occupant-info">
                      <span className="occupant-name">
                        {occupant.firstName} {occupant.lastName}
                      </span>
                      <span className="occupant-relationship">{occupant.relationship}</span>
                    </div>
                    <div className="occupant-details">
                      <span className={`adult-badge ${occupant.isAdult ? 'adult' : 'minor'}`}>
                        {occupant.isAdult ? 'Adult' : 'Minor'}
                      </span>
                      {occupant.willBeOnLease && (
                        <span className="lease-badge">On Lease</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* References Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <FileText size={20} />
              <h3>References</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('references')}
            >
              <Edit size={14} />
              Edit references
            </button>
          </div>
          <div className="section-content">
            {app.references.length === 0 ? (
              <p className="no-data">No references provided</p>
            ) : (
              <div className="references-list">
                {app.references.map((ref) => (
                  <div key={ref.id} className="reference-card">
                    <div className="reference-header">
                      <span className="reference-name">{ref.name}</span>
                      <span className="reference-relationship">{ref.relationship}</span>
                    </div>
                    <div className="reference-contact">
                      <span className="with-icon">
                        <Phone size={14} />
                        {formatPhone(ref.phone)}
                      </span>
                      {ref.email && (
                        <span className="with-icon">
                          <Mail size={14} />
                          {ref.email}
                        </span>
                      )}
                    </div>
                    {ref.yearsKnown && (
                      <span className="years-known">Known for {ref.yearsKnown} years</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accessibility / Preferences Section */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <Accessibility size={20} />
              <h3>Preferences & Accessibility</h3>
            </div>
            <button
              className="edit-section-btn"
              onClick={() => openEditPanel('accessibility')}
            >
              <Edit size={14} />
              Edit accessibilities
            </button>
          </div>
          <div className="section-content grid-2">
            <div className="info-group">
              <label>Pets</label>
              <span className="with-indicator">
                {app.accessibility.hasPets ? (
                  <>
                    <Check size={14} className="indicator yes" />
                    Yes
                  </>
                ) : (
                  <>
                    <X size={14} className="indicator no" />
                    No
                  </>
                )}
              </span>
              {app.accessibility.hasPets && app.accessibility.petDetails && (
                <div className="pet-details">
                  {app.accessibility.petDetails.map((pet) => (
                    <span key={pet.id} className="pet-badge">
                      {pet.type} {pet.breed && `(${pet.breed})`} - {pet.weight}lbs
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="info-group">
              <label>Smoking</label>
              <span className="capitalize">
                {app.accessibility.smokingPreference.replace('-', ' ')}
              </span>
            </div>
            <div className="info-group">
              <label>Parking Required</label>
              <span className="with-indicator">
                {app.accessibility.parkingRequired ? (
                  <>
                    <Check size={14} className="indicator yes" />
                    Yes {app.accessibility.parkingType && `(${app.accessibility.parkingType})`}
                  </>
                ) : (
                  <>
                    <X size={14} className="indicator no" />
                    No
                  </>
                )}
              </span>
            </div>
            {app.accessibility.accessibilityNeeds && (
              <div className="info-group full-width">
                <label>Accessibility Needs</label>
                <span>{app.accessibility.accessibilityNeeds}</span>
              </div>
            )}
          </div>
        </div>

        {/* Background Information */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <AlertCircle size={20} />
              <h3>Background Information</h3>
            </div>
          </div>
          <div className="section-content grid-3">
            <div className="background-item">
              <label>Prior Evictions</label>
              <span className={`background-status ${app.hasEviction ? 'warning' : 'clear'}`}>
                {app.hasEviction ? 'Yes' : 'No'}
              </span>
              {app.hasEviction && app.evictionDetails && (
                <p className="details-note">{app.evictionDetails}</p>
              )}
            </div>
            <div className="background-item">
              <label>Felony History</label>
              <span className={`background-status ${app.hasFelony ? 'warning' : 'clear'}`}>
                {app.hasFelony ? 'Yes' : 'No'}
              </span>
              {app.hasFelony && app.felonyDetails && (
                <p className="details-note">{app.felonyDetails}</p>
              )}
            </div>
            <div className="background-item">
              <label>Bankruptcy</label>
              <span className={`background-status ${app.hasBankruptcy ? 'warning' : 'clear'}`}>
                {app.hasBankruptcy ? 'Yes' : 'No'}
              </span>
              {app.hasBankruptcy && app.bankruptcyDetails && (
                <p className="details-note">{app.bankruptcyDetails}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <Phone size={20} />
              <h3>Emergency Contact</h3>
            </div>
          </div>
          <div className="section-content grid-3">
            <div className="info-group">
              <label>Name</label>
              <span>{app.emergencyContactName || 'Not provided'}</span>
            </div>
            <div className="info-group">
              <label>Phone</label>
              <span>{formatPhone(app.emergencyContactPhone)}</span>
            </div>
            <div className="info-group">
              <label>Relationship</label>
              <span>{app.emergencyContactRelationship || 'Not provided'}</span>
            </div>
          </div>
        </div>

        {/* Consent & Dates */}
        <div className="detail-section">
          <div className="section-header">
            <div className="section-title">
              <Calendar size={20} />
              <h3>Application Timeline & Consent</h3>
            </div>
          </div>
          <div className="section-content">
            <div className="grid-2">
              <div className="info-group">
                <label>Created</label>
                <span>{formatDate(app.createdAt)}</span>
              </div>
              <div className="info-group">
                <label>Last Updated</label>
                <span>{formatDate(app.updatedAt)}</span>
              </div>
              <div className="info-group">
                <label>Submitted</label>
                <span>{app.submittedAt ? formatDate(app.submittedAt) : 'Not yet submitted'}</span>
              </div>
              <div className="info-group">
                <label>Signature Date</label>
                <span>{app.signatureDate ? formatDate(app.signatureDate) : 'Not signed'}</span>
              </div>
            </div>
            <div className="consent-items">
              <div className={`consent-item ${app.backgroundCheckConsent ? 'consented' : ''}`}>
                {app.backgroundCheckConsent ? <Check size={16} /> : <X size={16} />}
                Background Check Consent
              </div>
              <div className={`consent-item ${app.creditCheckConsent ? 'consented' : ''}`}>
                {app.creditCheckConsent ? <Check size={16} /> : <X size={16} />}
                Credit Check Consent
              </div>
              <div className={`consent-item ${app.termsAccepted ? 'consented' : ''}`}>
                {app.termsAccepted ? <Check size={16} /> : <X size={16} />}
                Terms & Conditions Accepted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailView;
