import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import SideBar from './components/SideBar/SideBar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import UserData from './pages/UserData/UserData';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const url = import.meta.env.VITE_APP_URL;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <button 
        onClick={handleLogout} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Logout
      </button>
      <hr />
      <div className='app-content'>
        <SideBar />
        <Routes>
          <Route path='/add' element={<Add url={url} />} />
          <Route path='/list' element={<List url={url} />} />
          <Route path='/orders' element={<Orders url={url} />} />
          <Route path='/users' element={<UserData url={url} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
