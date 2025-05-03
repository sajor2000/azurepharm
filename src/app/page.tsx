'use client';

import { useState } from 'react';
import InsuranceForm from '@/components/InsuranceForm';
import Chat from '@/components/Chat';

export default function Home() {
  const [formData, setFormData] = useState<{
    insurance: string;
    preference: string;
    medicationClass: string;
  } | null>(null);
  
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleFormSubmit = (data: {
    insurance: string;
    preference: string;
    medicationClass: string;
  }) => {
    setFormData(data);
    setIsFormSubmitted(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-primary-800 mb-8">
        Pharmacy Inhaler Formulary Assistant
      </h1>
      
      <div className="w-full max-w-4xl mx-auto">
        {!isFormSubmitted ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-primary-700">
              Enter Your Insurance Information
            </h2>
            <InsuranceForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <h2 className="text-lg font-medium text-primary-800 mb-2">Your Selected Information</h2>
              <p><span className="font-medium">Insurance:</span> {formData?.insurance}</p>
              <p><span className="font-medium">Preference:</span> {formData?.preference}</p>
              <p><span className="font-medium">Medication Class:</span> {formData?.medicationClass}</p>
              <button 
                onClick={() => setIsFormSubmitted(false)}
                className="mt-2 text-sm text-primary-600 hover:text-primary-800 underline"
              >
                Change Information
              </button>
            </div>
            
            <Chat formData={formData} />
          </div>
        )}
      </div>
    </main>
  );
}
