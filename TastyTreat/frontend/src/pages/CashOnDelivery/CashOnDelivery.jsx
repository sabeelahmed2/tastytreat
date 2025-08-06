import React from 'react';
import { useNavigate } from 'react-router-dom';

const CashOnDelivery = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Order Placed Successfully!</h1>
      <p>Your order has been placed with Cash on Delivery.</p>
      <button onClick={goToHome} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
        Back to Home
      </button>
    </div>
  );
};

export default CashOnDelivery;
