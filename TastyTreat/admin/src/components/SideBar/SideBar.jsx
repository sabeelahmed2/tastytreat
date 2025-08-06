import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import './SideBar.css'

const SideBar = () => {
  return (
    <div className='sidebar'>
        <div className='sidebar-options'>
            <NavLink to='/add' className='sidebar-option'>
                <img src={assets.add_icon} alt="" />
                <p>Add Items</p>
            </NavLink>
            <NavLink to='/list' className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>List Items</p>
            </NavLink>
            <NavLink to='/orders' className='sidebar-option'>
                <img src={assets.order_icon} alt="" />
                <p>Orders</p>
            </NavLink>
            <NavLink to='/users' className='sidebar-option'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M7 21v-2a4 4 0 0 1 3-3.87"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5 7a4 4 0 0 1 4-4"></path>
                  <path d="M19 7a4 4 0 0 0-4-4"></path>
                </svg>
                <p>Registered Data</p>
            </NavLink>
        </div>
    </div>
  )
}

export default SideBar