import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Order Successfully Placed</h1>
      <p>Thank you for your order!</p>
      <Link to="/" style={{ color: '#3399cc', textDecoration: 'underline' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default OrderSuccess;
