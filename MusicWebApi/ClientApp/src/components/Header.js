import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import FileUpload from '../components/FileUpload';

function Header() {
    const isAuth = localStorage.getItem('isAuth');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuth');
        navigate('/', {replace: true});
      };
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/profiles" className="nav-link">Profiles</Link>
          </li>
          <li className="nav-item">
            <Link to="/music" className="nav-link">Music</Link>
          </li>
          <li className="nav-item">
            <FileUpload/>
          </li>
        </ul>
        { !isAuth ? navigate("/") : ''}
        <Link onClick={logout} className="nav-link logout">logout</Link>
      </nav>
    </header>
  );
}

export default Header;
