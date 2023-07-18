import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import FileUpload from './components/FileUpload';
import AudioPlayer from './components/AudioPlayer';
import Home from './components/Home';
import Profile from './components/Profile';
import UsersProfiles from './components/UsersProfiles';

import { RequireAuth } from './hoc/RequireAuth';
import { RedirectFromLogin } from './hoc/RedirectFromLogin';


export default class App extends Component {
  static displayName = App.name;
  

  render() {
    return (
        <Routes>
            <Route path="/" element={<RedirectFromLogin><AuthForm /></RedirectFromLogin>} />
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/profiles/:id" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/profiles" element={<RequireAuth><UsersProfiles /></RequireAuth>} />
            <Route path="/upload" element={<RequireAuth><FileUpload /></RequireAuth>} />
            <Route path="/music" element={<RequireAuth><AudioPlayer /></RequireAuth>} />
        </Routes>
    );
  }
}
