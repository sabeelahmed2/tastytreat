import React from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx'
import Footer from './components/Footer/Footer.jsx'
import { useState } from 'react'
import LoginPopUp from './components/LoginPopUp/LoginPopUp.jsx'
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx'
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'
import CashOnDelivery from './pages/CashOnDelivery/CashOnDelivery.jsx'
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  return (
    <ThemeProvider>
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} setShowForgotPassword={setShowForgotPassword}/>}
      {showForgotPassword && <ForgotPassword setShowForgotPassword={setShowForgotPassword} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<PlaceOrder/>}/>
          <Route path='/order-success' element={React.createElement(React.lazy(() => import('./pages/OrderSuccess/OrderSuccess.jsx')))} />
          <Route path='/verify' element={<Verify/>}/>
          <Route path='/myorders' element={<MyOrders/>}/>
          <Route path='/cashondelivery' element={<CashOnDelivery/>}/>
          <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        </Routes>
      </div>
      <Footer/>
    </ThemeProvider>
  )
}

export default App
