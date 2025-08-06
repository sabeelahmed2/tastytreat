/* eslint-disable react/jsx-key */
import { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    discount,
    setDiscount,
    url
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState('');
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  const promoCodes = {
    'SAVE25': 25,
    'SAVE50': 50,
    'SAVE75': 75,
    'FREEDEL': 'FREEDEL'
  };

  const deliveryCost =
    isFreeDelivery || getTotalCartAmount() === 0
      ? 0
      : getTotalCartAmount() <= 100
      ? 70
      : getTotalCartAmount() <= 180
      ? 60
      : getTotalCartAmount() <= 250
      ? 50
      : getTotalCartAmount() <= 320
      ? 40
      : 30;

  const handleChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleSubmit = () => {
    if (getTotalCartAmount() === 0) {
      alert('Select some items from Menu to proceed.');
    } else if (promoCode === 'FREEDEL') {
      alert('Free Delivery promo applied.');
      setIsFreeDelivery(true);
    } else if (promoCodes[promoCode]) {
      alert('Promo Code applied Successfully.');
      setDiscount(promoCodes[promoCode]);
      setIsFreeDelivery(false); // reset free delivery if other promo used
    } else {
      alert('Invalid promo code. Please try again.');
    }

    setPromoCode(''); // optional: clear promo input after applying
  };

  return (
    <div className='cart'>
      <div className='cart-items'>
        <div className='cart-items-title'>
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + '/images/' + item.image} alt='' />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>

      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>₹{deliveryCost}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Discount</p>
              <p>₹{discount}</p>
            </div>
            <hr />
            <div className='cart-total-details'>
              <p>Total</p>
              <p>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + deliveryCost - discount}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>

        <div className='cart-promocode'>
          <div>
            <p>Have a Promo Code?</p>
            <div className='cart-promocode-input'>
              <input
                type='text'
                placeholder='Promo Code'
                value={promoCode}
                onChange={handleChange}
              />
              <button onClick={handleSubmit}>SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
