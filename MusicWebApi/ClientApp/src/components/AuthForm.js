import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(true);
  
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginForm) {
      const formData = new FormData();
      formData.append('Name', null);
      formData.append('Email', email);
      formData.append('Password', password);
      formData.append('UserMusics', null);
      fetch(`https://localhost:7104/api/user/login`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          const data = response.json();
          data.then((e) => {
            localStorage.setItem('accessToken', e);
            localStorage.setItem('isAuth', JSON.stringify(true));
            navigate("/home", {replace: true});
          });
          console.log('Request successful');
        }
      })
      .catch((error) => {
          console.error('Error uploading file:', error);
        });
    } else {
      const formData = new FormData();
      formData.append('Name', name);
      formData.append('Email', email);
      formData.append('Password', password);
      formData.append('UserMusics', null);
      fetch(`https://localhost:7104/api/user/register`, {
        method: 'POST',
        body: formData,
      })
      .then((response) => {
        if (response.ok) {
          console.log('Request successful');
        }
      })
      .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  const handleToggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <div className="container">
      <div className="form">
      <h2>{isLoginForm ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
      {!isLoginForm && (
        <div>
          <label>Name:</label>
          <input type="Name" value={name} onChange={handleNameChange} />
        </div>
        )}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        {!isLoginForm && (
          <div>
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </div>
        )}
        <div className="flex-gap">
          <button type="submit">{isLoginForm ? 'Login' : 'Register'}</button>
          <button type="button" onClick={handleToggleForm}>
            {isLoginForm ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default AuthForm;
