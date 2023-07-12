import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import FileUploadComponent from './components/FileUploadComponent';
import AudioPlayer from './components/AudioPlayer';
import Profile from './components/Profile';

import { RequireAuth } from './hoc/RequireAuth';
import { RedirectFromLogin } from './hoc/RedirectFromLogin';


export default class App extends Component {
  static displayName = App.name;
  

  render() {
    return (
        <Routes>
            <Route path="/" element={<RedirectFromLogin><AuthForm /></RedirectFromLogin>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/upload" element={<RequireAuth><FileUploadComponent /></RequireAuth>} />
            <Route path="/music" element={<RequireAuth><AudioPlayer /></RequireAuth>} />
        </Routes>
    );
  }
}
