import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Military Asset Management</div>
      <div style={styles.links}>
        <button 
          style={{...styles.navBtn, ...(isActive('/dashboard') ? styles.active : {})}}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button 
          style={{...styles.navBtn, ...(isActive('/purchases') ? styles.active : {})}}
          onClick={() => navigate('/purchases')}
        >
          Purchases
        </button>
        <button 
          style={{...styles.navBtn, ...(isActive('/transfers') ? styles.active : {})}}
          onClick={() => navigate('/transfers')}
        >
          Transfers
        </button>
        <button 
          style={{...styles.navBtn, ...(isActive('/assignments') ? styles.active : {})}}
          onClick={() => navigate('/assignments')}
        >
          Assignments
        </button>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    padding: '15px 30px',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  links: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  navBtn: {
    padding: '8px 15px',
    backgroundColor: 'transparent',
    color: '#D1D5DB',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
  active: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
  },
  logoutBtn: {
    padding: '8px 15px',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
};

export default NavBar;
