/* eslint-disable react/prop-types */
import {useContext, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

const Navbar = ({setShowLogin}) => {

  const [menu, setMenu] = useState("home");

  const {getTotalCartAmount, token, setToken} = useContext(StoreContext);
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token")
    setToken("")
    navigate("/")

  }

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="Tomato Logo" /></Link>
      <ul className='navbar-menu'>
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu=="mobile-app"?"active":""}>Mobile App</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact Us</a>
      </ul>
      <div className='navbar-right'>
        <div className='navbar-search-icon'>
          <Link to='/cart'><img src={assets.basket_icon} alt=""/></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?
        <button onClick={()=>setShowLogin(true)}>sign in</button>:
        <>
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" />Orders</li>
              <hr/>
              <li onClick={logout}><img src={assets.logout_icon} alt="" />Logout</li>
            </ul>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </>
        }
        
      </div>
    </div>
  )
}

export default Navbar