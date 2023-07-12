import React from 'react';
import jwt from 'jwt-decode';
import { useNavigate } from "react-router-dom";
function ProfilePage() {
    const token = localStorage.getItem('accessToken');
    const isAuth = localStorage.getItem('isAuth');
    const decodedtoken = jwt(token);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuth');
        navigate('/', {replace: true});
      };
  return ( 
    <div>
      { !isAuth ? navigate("/") : decodedtoken.name }
      <button onClick={logout}>logout</button>
    </div>
  );
}

export default ProfilePage;
