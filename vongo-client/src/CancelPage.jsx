import React from 'react';
import { useLocation } from 'react-router-dom';

const CancelPage = () => {


  return (
    <div>
      <h1>Payment Canceled</h1>
      <p>Your payment was canceled. Please try again.</p>
      {/* Optionally, display more details using queryParams */}
    </div>
  );
};

export default CancelPage;
