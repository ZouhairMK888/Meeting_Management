import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './personalInfo.css';
import Header from '../header/header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';

const PersonalInfo = () => {
  const [info, setInfo] = useState({ fname: '', lname: '' });
  const [passwords, setPasswords] = useState({ newPassword: '' });

  useEffect(() => {
    axios.get('http://localhost:8081/admin/info', { withCredentials: true })
      .then(response => {
        setInfo({ fname: response.data.fname, lname: response.data.lname });
      })
      .catch(err => {
        console.error('Error fetching personal info:', err);
      });
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/admin/updateInfo', info, { withCredentials: true })
      .then(response => {
        alert('Personal info updated successfully');
      })
      .catch(err => {
        console.error('Error updating personal info:', err);
      });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/admin/updatePassword', passwords, { withCredentials: true })
      .then(response => {
        alert('Password updated successfully');
      })
      .catch(err => {
        console.error('Error updating password:', err);
      });
  };

  return (
    <div className='all'>
      <Header /> 
      <div  className='pi'>
      <div className="personal-info-container">
        <h2><FontAwesomeIcon icon={faUser} /> Update Personal Info</h2>
        <form onSubmit={handleInfoSubmit}>
          <div className="form-group">
            <label>First Name:</label>
            <input 
              type="text" 
              name="fname" 
              value={info.fname} 
              onChange={handleInfoChange} 
              placeholder='Enter New First Name' 
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input 
              type="text" 
              name="lname" 
              value={info.lname} 
              onChange={handleInfoChange} 
              placeholder='Enter New Last Name' 
            />
          </div>
          <button className='hhh' type="submit">Update Info</button>
        </form>

        <h2>Update Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>New Password:</label>
            <input 
              type="password" 
              name="newPassword" 
              value={passwords.newPassword} 
              onChange={handlePasswordChange} 
              placeholder='Enter Your New Password' 
            />
          </div>
          <button className='hhh' type="submit">Update Password</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
