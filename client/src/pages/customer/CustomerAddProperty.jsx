import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import GetStarted from '../GetStarted';

export const CustomerAddProperty = () => {
  const { customer, setCases, cases } = useOutletContext();
  const navigate = useNavigate();

  const handleCaseCreated = (newCase) => {
    const updatedCases = [newCase, ...(cases || [])];
    if (setCases) {
      setCases(updatedCases);
    }
    localStorage.setItem('suraksha_customer_cases', JSON.stringify(updatedCases));
  };

  return (
    <div className="customer-add-property-container" style={{ padding: '0 0.5rem' }}>
      <header className="admin-topbar" style={{ marginBottom: '1rem' }}>
        <div className="admin-topbar-title">
          <h2>4. Add New Property Verification</h2>
          <p>Submit another property, flat, or land plot for legal title scrutiny. Your contact details are pre-filled automatically.</p>
        </div>
      </header>

      {/* Render the exact GetStarted form with customer details auto-filled */}
      <GetStarted 
        initialCustomer={customer} 
        onCaseCreated={handleCaseCreated}
        isCustomerPortal={true}
      />
    </div>
  );
};

export default CustomerAddProperty;
