import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faHome, faList, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(response => {
        console.log(response.data);
        navigate('/'); // Redirect to login page after logout
      })
      .catch(err => {
        console.error('Error logging out:', err);
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="Public/aria1.png" alt="Logo" className="logo" />
      </div>
      <div className="navbar-center">
        <div className="nav-items-container">
          <Link to="/home" className="nav-item">
            <FontAwesomeIcon icon={faHome} className="fa-icon" />
            Home
          </Link>
          <Link to="/form" className="nav-item">
            <FontAwesomeIcon icon={faFileAlt} className="fa-icon" />
            Form
          </Link>
          <Link to="/list" className="nav-item">
            <FontAwesomeIcon icon={faList} className="fa-icon" />
            Meeting List
          </Link>
          <Link to="/personal-info" className="nav-item">
            <FontAwesomeIcon icon={faUser}  className="fa-icon"/>
            Personal Info
          </Link>
        </div>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout} className="nav-item logout">
          <FontAwesomeIcon icon={faSignOutAlt} className="fa-icon" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
