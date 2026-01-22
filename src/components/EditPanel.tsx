import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Save } from 'lucide-react';
import { useApplicationContext } from '../context/ApplicationContext';
import { useAlert } from '../context/AlertContext';
import {
  PersonalInfo,
  Address,
  Employment,
  Reference,
  Occupant,
  Accessibility,
} from '../types';
import '../styles/EditPanel.css';

export const EditPanel: React.FC = () => {
  const {
    selectedApplication,
    editSection,
    isEditPanelOpen,
    closeEditPanel,
    updateApplication,
    addOccupant,
    deleteOccupant,
  } = useApplicationContext();

  const { showPurpleAlert } = useAlert();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for each section
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [occupants, setOccupants] = useState<Occupant[]>([]);
  const [accessibility, setAccessibility] = useState<Accessibility | null>(null);

  // New occupant form
  const [newOccupant, setNewOccupant] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    isAdult: true,
    willBeOnLease: false,
  });

  // Load data when section changes
  useEffect(() => {
    if (!selectedApplication) return;

    switch (editSection) {
      case 'personal':
        setPersonalInfo({ ...selectedApplication.personalInfo });
        break;
      case 'address':
        setAddress({ ...selectedApplication.currentAddress });
        break;
      case 'employment':
        setEmployment([...selectedApplication.employment]);
        break;
      case 'references':
        setReferences([...selectedApplication.references]);
        break;
      case 'occupants':
        setOccupants([...selectedApplication.occupants]);
        break;
      case 'accessibility':
        setAccessibility({ ...selectedApplication.accessibility });
        break;
    }
  }, [selectedApplication, editSection]);

  if (!isEditPanelOpen || !selectedApplication) return null;

  const handleSave = async () => {
    setIsSubmitting(true);

    let updates: Partial<typeof selectedApplication> = {};

    switch (editSection) {
      case 'personal':
        if (personalInfo) updates = { personalInfo };
        break;
      case 'address':
        if (address) updates = { currentAddress: address };
        break;
      case 'employment':
        updates = { employment };
        break;
      case 'references':
        updates = { references };
        break;
      case 'accessibility':
        if (accessibility) updates = { accessibility };
        break;
    }

    const success = await updateApplication(selectedApplication.id, updates);

    if (success) {
      showPurpleAlert('Success', 'Application updated successfully');
      closeEditPanel();
    } else {
      showPurpleAlert('Error', 'Failed to update application');
    }

    setIsSubmitting(false);
  };

  const handleAddOccupant = async () => {
    if (!newOccupant.firstName || !newOccupant.lastName) {
      showPurpleAlert('Error', 'Please fill in first and last name');
      return;
    }

    const success = await addOccupant(selectedApplication.id, newOccupant);

    if (success) {
      showPurpleAlert('Success', 'Occupant added successfully');
      setNewOccupant({
        firstName: '',
        lastName: '',
        relationship: '',
        isAdult: true,
        willBeOnLease: false,
      });
      // Refresh occupants list
      setOccupants(prev => [...prev]);
    }
  };

  const handleDeleteOccupant = async (occupantId: string) => {
    const success = await deleteOccupant(selectedApplication.id, occupantId);

    if (success) {
      showPurpleAlert('Success', 'Occupant removed');
      setOccupants(prev => prev.filter(o => o.id !== occupantId));
    }
  };

  const getSectionTitle = (): string => {
    const titles: Record<string, string> = {
      personal: 'Edit Personal Information',
      address: 'Edit Address',
      employment: 'Edit Employment',
      references: 'Edit References',
      occupants: 'Edit Occupants',
      accessibility: 'Edit Accessibility & Preferences',
    };
    return titles[editSection] || 'Edit';
  };

  const renderPersonalSection = () => {
    if (!personalInfo) return null;

    return (
      <div className="edit-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              value={personalInfo.middleName || ''}
              onChange={(e) => setPersonalInfo({ ...personalInfo, middleName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Driver's License</label>
            <input
              type="text"
              value={personalInfo.driversLicense || ''}
              onChange={(e) => setPersonalInfo({ ...personalInfo, driversLicense: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>License State</label>
            <input
              type="text"
              value={personalInfo.driversLicenseState || ''}
              onChange={(e) => setPersonalInfo({ ...personalInfo, driversLicenseState: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderAddressSection = () => {
    if (!address) return null;

    return (
      <div className="edit-form">
        <div className="form-row">
          <div className="form-group full">
            <label>Street Address</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Unit/Apt</label>
            <input
              type="text"
              value={address.unit || ''}
              onChange={(e) => setAddress({ ...address, unit: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Rent</label>
            <input
              type="number"
              value={address.monthlyRent || ''}
              onChange={(e) => setAddress({ ...address, monthlyRent: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label>Landlord Name</label>
            <input
              type="text"
              value={address.landlordName || ''}
              onChange={(e) => setAddress({ ...address, landlordName: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Landlord Phone</label>
            <input
              type="tel"
              value={address.landlordPhone || ''}
              onChange={(e) => setAddress({ ...address, landlordPhone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Reason for Leaving</label>
            <input
              type="text"
              value={address.reasonForLeaving || ''}
              onChange={(e) => setAddress({ ...address, reasonForLeaving: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderEmploymentSection = () => {
    return (
      <div className="edit-form">
        {employment.map((emp, index) => (
          <div key={emp.id} className="employment-edit-card">
            <h4>Employment {index + 1}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Employer Name</label>
                <input
                  type="text"
                  value={emp.employerName}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, employerName: e.target.value };
                    setEmployment(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={emp.jobTitle}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, jobTitle: e.target.value };
                    setEmployment(updated);
                  }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Monthly Income</label>
                <input
                  type="number"
                  value={emp.monthlyIncome}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, monthlyIncome: parseInt(e.target.value) || 0 };
                    setEmployment(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select
                  value={emp.employmentType}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, employmentType: e.target.value as Employment['employmentType'] };
                    setEmployment(updated);
                  }}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Supervisor Name</label>
                <input
                  type="text"
                  value={emp.supervisorName || ''}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, supervisorName: e.target.value };
                    setEmployment(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Employer Phone</label>
                <input
                  type="tel"
                  value={emp.employerPhone || ''}
                  onChange={(e) => {
                    const updated = [...employment];
                    updated[index] = { ...emp, employerPhone: e.target.value };
                    setEmployment(updated);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderReferencesSection = () => {
    return (
      <div className="edit-form">
        {references.map((ref, index) => (
          <div key={ref.id} className="reference-edit-card">
            <h4>Reference {index + 1}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => {
                    const updated = [...references];
                    updated[index] = { ...ref, name: e.target.value };
                    setReferences(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  value={ref.relationship}
                  onChange={(e) => {
                    const updated = [...references];
                    updated[index] = { ...ref, relationship: e.target.value };
                    setReferences(updated);
                  }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => {
                    const updated = [...references];
                    updated[index] = { ...ref, phone: e.target.value };
                    setReferences(updated);
                  }}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={ref.email || ''}
                  onChange={(e) => {
                    const updated = [...references];
                    updated[index] = { ...ref, email: e.target.value };
                    setReferences(updated);
                  }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Years Known</label>
                <input
                  type="number"
                  value={ref.yearsKnown || ''}
                  onChange={(e) => {
                    const updated = [...references];
                    updated[index] = { ...ref, yearsKnown: parseInt(e.target.value) || undefined };
                    setReferences(updated);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOccupantsSection = () => {
    return (
      <div className="edit-form">
        {/* Existing Occupants */}
        {occupants.length > 0 && (
          <div className="occupants-list-edit">
            <h4>Current Occupants</h4>
            {occupants.map((occ) => (
              <div key={occ.id} className="occupant-edit-item">
                <div className="occupant-edit-info">
                  <span className="occupant-name">{occ.firstName} {occ.lastName}</span>
                  <span className="occupant-relationship">{occ.relationship}</span>
                </div>
                <button
                  className="delete-occupant-btn"
                  onClick={() => handleDeleteOccupant(occ.id)}
                  title="Remove occupant"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Occupant */}
        <div className="add-occupant-section">
          <h4>Add New Occupant</h4>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={newOccupant.firstName}
                onChange={(e) => setNewOccupant({ ...newOccupant, firstName: e.target.value })}
                placeholder="First name"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={newOccupant.lastName}
                onChange={(e) => setNewOccupant({ ...newOccupant, lastName: e.target.value })}
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Relationship</label>
              <input
                type="text"
                value={newOccupant.relationship}
                onChange={(e) => setNewOccupant({ ...newOccupant, relationship: e.target.value })}
                placeholder="e.g., Spouse, Child, Roommate"
              />
            </div>
          </div>
          <div className="form-row checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newOccupant.isAdult}
                onChange={(e) => setNewOccupant({ ...newOccupant, isAdult: e.target.checked })}
              />
              Is Adult (18+)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newOccupant.willBeOnLease}
                onChange={(e) => setNewOccupant({ ...newOccupant, willBeOnLease: e.target.checked })}
              />
              Will be on Lease
            </label>
          </div>
          <button className="add-occupant-btn" onClick={handleAddOccupant}>
            <Plus size={16} />
            Add Occupant
          </button>
        </div>
      </div>
    );
  };

  const renderAccessibilitySection = () => {
    if (!accessibility) return null;

    return (
      <div className="edit-form">
        <div className="form-row checkboxes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={accessibility.hasPets}
              onChange={(e) => setAccessibility({ ...accessibility, hasPets: e.target.checked })}
            />
            Has Pets
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={accessibility.parkingRequired}
              onChange={(e) => setAccessibility({ ...accessibility, parkingRequired: e.target.checked })}
            />
            Parking Required
          </label>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Smoking Preference</label>
            <select
              value={accessibility.smokingPreference}
              onChange={(e) => setAccessibility({
                ...accessibility,
                smokingPreference: e.target.value as Accessibility['smokingPreference'],
              })}
            >
              <option value="non-smoking">Non-smoking</option>
              <option value="smoking-outside">Smoking Outside Only</option>
              <option value="smoking-allowed">Smoking Allowed</option>
            </select>
          </div>
          {accessibility.parkingRequired && (
            <div className="form-group">
              <label>Parking Type</label>
              <select
                value={accessibility.parkingType || ''}
                onChange={(e) => setAccessibility({
                  ...accessibility,
                  parkingType: e.target.value as Accessibility['parkingType'],
                })}
              >
                <option value="">Select type</option>
                <option value="covered">Covered</option>
                <option value="uncovered">Uncovered</option>
                <option value="garage">Garage</option>
                <option value="street">Street</option>
              </select>
            </div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group full">
            <label>Accessibility Needs</label>
            <textarea
              value={accessibility.accessibilityNeeds || ''}
              onChange={(e) => setAccessibility({ ...accessibility, accessibilityNeeds: e.target.value })}
              placeholder="Describe any accessibility requirements..."
              rows={3}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full">
            <label>Additional Requirements</label>
            <textarea
              value={accessibility.additionalRequirements || ''}
              onChange={(e) => setAccessibility({ ...accessibility, additionalRequirements: e.target.value })}
              placeholder="Any other requirements or preferences..."
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (editSection) {
      case 'personal':
        return renderPersonalSection();
      case 'address':
        return renderAddressSection();
      case 'employment':
        return renderEmploymentSection();
      case 'references':
        return renderReferencesSection();
      case 'occupants':
        return renderOccupantsSection();
      case 'accessibility':
        return renderAccessibilitySection();
      default:
        return null;
    }
  };

  return (
    <div className="edit-panel-overlay" onClick={closeEditPanel}>
      <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
        <div className="edit-panel-header">
          <h3>{getSectionTitle()}</h3>
          <button className="close-panel-btn" onClick={closeEditPanel}>
            <X size={20} />
          </button>
        </div>

        <div className="edit-panel-content">
          {renderSectionContent()}
        </div>

        <div className="edit-panel-footer">
          <button className="cancel-btn" onClick={closeEditPanel}>
            Cancel
          </button>
          {editSection !== 'occupants' && (
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save size={16} />
                  Done
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPanel;
