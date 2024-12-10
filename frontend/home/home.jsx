import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import Header from '../header/header';


const Home = () => {
  return (
    <div className="home">
      <Header/>
      <div className='pic'>
      <div className="content-container">
        <div className="text-container">
          <p className="intro-text">Manage all your meetings in one place</p>
          <p className='outro'>Get started by one click</p>
          <Link to="/form">
            <button className="cta-button">Manage</button>
          </Link>
        </div>
        <div className="image-container">
          <img src="public\meet.jpg" alt="Meeting Manager" />
        </div>
      </div>
      </div>
      <div className="features">
        <div className="feature">
          <h2>Create Meetings</h2>
          <p>Easily create and schedule new meetings</p>
        </div>
        <div className="feature">
          <h2>Add Participants</h2>
          <p>Invite and manage participants for your meetings</p>
        </div>
        <div className="feature">
          <h2>Document Discussions</h2>
          <p>Keep track of key points and decisions made during meetings</p>
        </div>
      </div>
      <footer className="home-footer">
        &copy; ARIA GROUPE. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
