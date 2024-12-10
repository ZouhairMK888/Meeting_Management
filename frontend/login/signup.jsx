import React, { useState } from 'react';
import './login.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock, faUser} from "@fortawesome/free-solid-svg-icons";

function Signup() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result === 'Success') {
        alert('Signup successful!');
        navigate('/')
      } else if (result.errors) {
        setError(result.errors.map(err => err.msg).join(', '));
      } else if (result.error) {
        setError(result.error);
      } else {
        setError('Signup failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Signup error.');
    }
  };

  return (
    <div>
      <header className="header"></header>
      <div className="background"></div>
      <div className="container">
        <div className="item">
          <img src="public/aria1.png" alt="aria" className="logo" />
          <div className="text-item">
            <h2>
              Welcome! <br />
              <span>To Our Community</span>
            </h2>
            <p>Aria Meetings. Log in to access and manage your meetings with ease.</p>
            <div className="social-icon">
              <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#"><FontAwesomeIcon icon={faGoogle} /></a>
              <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
        </div>
        <div className="login-section">
          <div className="form-box login">
            <form onSubmit={handleSubmit}>
              <h2>Sign Up</h2>
              {error && <p className="error">{error}</p>}
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input type="text" className='text' name="fname" required onChange={handleChange} />
                <label>First Name</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input type="text" className='text' name="lname" required onChange={handleChange} />
                <label>Last Name</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input type="email" name="email" required onChange={handleChange} />
                <label>Email</label>
              </div>
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input type="password" name="password" required onChange={handleChange} />
                <label>Password</label>
              </div>
              <div className="remember-password">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
              </div>
              <button className="btn">Sign Up</button>
              <div className="create-account">
                <p>
                  Already have an account? <Link to="/" className="register-link">Sign in</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
