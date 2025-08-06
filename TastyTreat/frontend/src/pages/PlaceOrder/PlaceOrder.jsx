/* eslint-disable react-hooks/exhaustive-deps */
import './PlaceOrder.css'
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const {getTotalCartAmount, discount, token, food_list, cartItems, url} = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    setFeedbackMessage(""); // Clear previous feedback
    let orderItems = [];
    food_list.map((item)=>{
       if (cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo);
       }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
      delivery: deliveryCost,
      discount: discount,
      paymentMethod: paymentMethod
    }
    try {
      let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}})
      if (response.data.success) {
        setFeedbackMessage("Order placed successfully!");
        if (paymentMethod === "cod") {
          // Show popup alert and then redirect to order success page
          alert("Order placed successfully with Cash on Delivery!");
          navigate("/order-success");
        } else if (paymentMethod === "razorpay" || paymentMethod === "upi") {
          const { order_id, amount, orderId } = response.data;
          
          // Load Razorpay script dynamically
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
          
          script.onload = () => {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_P33jLP8tVOfoLx',
              amount: amount,
              currency: "INR",
              name: "TastyTreat",
              description: "Order Payment",
              order_id: order_id,
              handler: async function (response) {
                try {
                  const verifyResponse = await axios.post(
                    url + "/api/order/verify",
                    {
                      orderId: orderId,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      success: true
                    },
                    { headers: { token } }
                  );
                  
                  if (verifyResponse.data.success) {
                    alert("Payment successful!");
                    window.location.href = "/verify?success=true&orderId=" + orderId;
                  } else {
                    alert("Payment verification failed");
                  }
                } catch (error) {
                  console.error("Payment verification error:", error);
                  alert("Payment verification error");
                }
              },
              prefill: {
                name: data.firstName + " " + data.lastName,
                email: data.email,
                contact: data.phone
              },
              theme: {
                color: "#3399cc"
              }
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
            
            razorpayInstance.on('payment.failed', function (response) {
              alert("Payment failed: " + response.error.description);
              console.error("Payment failed:", response);
            });
          };
        } else {
          // For other payment methods, redirect to success page
          window.location.href = "/verify?success=true&orderId=" + response.data.orderId;
        }
      }
      else {
        alert("Error: " + (response.data.message || "Unknown error"));
        console.error("Order placement error:", response.data);
      }
    } catch (error) {
      alert("Error: " + error.message);
      console.error("Order placement exception:", error);
    }
  }

  const deliveryCost =  getTotalCartAmount() === 0 ? 0 :
                        getTotalCartAmount() <= 100 ? 0 :
                        getTotalCartAmount() <= 180 ? 60 :
                        getTotalCartAmount() <= 250 ? 50 :
                        getTotalCartAmount() <= 320 ? 40 :
                        30;

  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      navigate("/cart")
    }
    else if (getTotalCartAmount()===0) {
      navigate("/cart")
    }
  },[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className='place-order-left'>
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-fields'>
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip Code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type='text' placeholder='Phone'/>
      </div>
      <div className='place-order-right'>
      <div className='cart-total'>
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <p>Delivery Fee</p>
              <p>₹{deliveryCost}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <p>Discount</p>
              <p>₹{discount}</p>
            </div>
            <hr/>
            <div className='cart-total-details'>
              <p>Total</p>
              <p>₹{getTotalCartAmount()+deliveryCost-discount}</p>
            </div>
          </div>
          <div className="payment-method-section">
            <p className='title'>Payment Method</p>
          <label>
              <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(e) => setPaymentMethod(e.target.value)} />
              Razorpay
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} />
              Pay Later
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
              Cash on Delivery
            </label>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
