import React from 'react';
import Login from '../login/login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Signup from '../login/signup';
import Form from '../form/form'
import Home from '../home/home';
import Header from '../header/header';
import MeetingList from '../list/list';
import Summary from '../list/Summary';
import UpdateMeeting from '../list/UpdateMeeting';
import PersonalInfo from '../login/PersonalInfo';

const App = () => {
  return (
    <BrowserRouter> 
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/form' element={<Form />}></Route>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/header' element={<Header />}></Route>
      <Route path='/list' element={<MeetingList />}></Route>
      <Route path='/summary/:id' element={<Summary/>}></Route>
      <Route path="/update/:id" element={<UpdateMeeting/>}></Route>
      <Route path="/personal-info" element={<PersonalInfo />}></Route>
      </Routes>
    </BrowserRouter>
    
  
  );
};

export default App;