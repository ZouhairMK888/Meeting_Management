import React, { useState, useEffect } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import Validation from './LoginValidation';

function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({})
  const [backendError, setBackendError] = useState([])
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values); // Use your Validation function here
    setErrors(err);

    if (!err.email && !err.password) {
        axios.post('http://localhost:8081/login', values)
        .then(res => {
          console.log(res.data); 
          if (res.data.errors) {
            setBackendError(res.data.errors);
          } else {
            setBackendError([]);
            if (res.data === "Success") {
              navigate('/home');
            } else if (res.data === "Failed") { 
              alert("Invalid Username or Password");
            }
          }
        })
        .catch(err => console.error(err));
    }
  };
  axios.defaults.withCredentials= true;
  useEffect(() => {
    axios.get('http://localhost:8081/form')
      .then(res => {
        if (res.data.valid) {
          navigate('/form')
        } else {
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);
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
            <p> Aria Meetings. Log in to access and manage your meetings with ease.</p>
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
              <h2>Sign In</h2>
              {backendError.map((error, index) => (
                <p key={index} className='text-danger'>{error.msg}</p>
              ))}
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input type="email" name="email" value={values.email} onChange={handleInput} required />
                <label>Email</label>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
              </div>
              <div className="input-box">
                <span className="icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input type="password" name="password" value={values.password} onChange={handleInput} required />
                <label>Password</label>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
              </div>
              <div className="remember-password">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
              </div>
              <button className="btn">Login</button>
              <div className="create-account">
                <p>
                  Create A New Account? <Link to="/signup" className="register-link">Sign Up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
