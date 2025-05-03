'use client';

import { useState } from 'react';

interface InsuranceFormProps {
  onSubmit: (data: {
    insurance: string;
    preference: string;
    medicationClass: string;
  }) => void;
}

const InsuranceForm: React.FC<InsuranceFormProps> = ({ onSubmit }) => {
  const [insurance, setInsurance] = useState('');
  const [preference, setPreference] = useState('');
  const [medicationClass, setMedicationClass] = useState('');
  const [errors, setErrors] = useState<{
    insurance?: string;
    preference?: string;
    medicationClass?: string;
  }>({});

  const insuranceOptions = [
    'Select Insurance',
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'Express Scripts',
    'Humana',
    'Meridian',
    'UnitedHealthcare',
    'Wellcare'
  ];

  const preferenceOptions = [
    'Select Preference',
    'Generic',
    'Brand',
    'No Preference'
  ];

  const medicationClassOptions = [
    'Select Medication Class',
    'ICS (Inhaled Corticosteroid)',
    'LABA (Long-Acting Beta Agonist)',
    'LAMA (Long-Acting Muscarinic Antagonist)',
    'ICS/LABA Combination',
    'LAMA/LABA Combination',
    'SABA (Short-Acting Beta Agonist)',
    'SAMA (Short-Acting Muscarinic Antagonist)',
    'ICS/LABA/LAMA Triple Combination'
  ];

  const validate = () => {
    const newErrors: {
      insurance?: string;
      preference?: string;
      medicationClass?: string;
    } = {};

    if (!insurance || insurance === 'Select Insurance') {
      newErrors.insurance = 'Please select an insurance provider';
    }

    if (!preference || preference === 'Select Preference') {
      newErrors.preference = 'Please select a preference';
    }

    if (!medicationClass || medicationClass === 'Select Medication Class') {
      newErrors.medicationClass = 'Please select a medication class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        insurance,
        preference,
        medicationClass
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
          Insurance Provider
        </label>
        <select
          id="insurance"
          className={`select w-full ${errors.insurance ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
        >
          {insuranceOptions.map((option) => (
            <option key={option} value={option === 'Select Insurance' ? '' : option}>
              {option}
            </option>
          ))}
        </select>
        {errors.insurance && (
          <p className="mt-1 text-sm text-red-600">{errors.insurance}</p>
        )}
      </div>

      <div>
        <label htmlFor="preference" className="block text-sm font-medium text-gray-700 mb-1">
          Medication Preference
        </label>
        <select
          id="preference"
          className={`select w-full ${errors.preference ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        >
          {preferenceOptions.map((option) => (
            <option key={option} value={option === 'Select Preference' ? '' : option}>
              {option}
            </option>
          ))}
        </select>
        {errors.preference && (
          <p className="mt-1 text-sm text-red-600">{errors.preference}</p>
        )}
      </div>

      <div>
        <label htmlFor="medicationClass" className="block text-sm font-medium text-gray-700 mb-1">
          Medication Class
        </label>
        <select
          id="medicationClass"
          className={`select w-full ${errors.medicationClass ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          value={medicationClass}
          onChange={(e) => setMedicationClass(e.target.value)}
        >
          {medicationClassOptions.map((option) => (
            <option key={option} value={option === 'Select Medication Class' ? '' : option}>
              {option}
            </option>
          ))}
        </select>
        {errors.medicationClass && (
          <p className="mt-1 text-sm text-red-600">{errors.medicationClass}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn w-full"
      >
        Get Recommendations
      </button>
    </form>
  );
};

export default InsuranceForm;
