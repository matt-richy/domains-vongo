import React from 'react';
import { useLocation } from 'react-router-dom';
import './returnPage.css'

const ReturnPage = () => {


  return (
    <div className='main-div'>
      <h1>Payment Successful</h1>
      <p>Your payment was successful. Thank you!</p>
      {/* Optionally, display more details using queryParams */}
    </div>
  );
};

export default ReturnPage;
