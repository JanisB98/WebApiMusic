import { Navigate } from 'react-router-dom';

const RedirectFromLogin = ({children}) => {
    const isAuth = localStorage.getItem('isAuth');

    if (isAuth) {
        return <Navigate to='/profile' />
    }

  return children;
}

export {RedirectFromLogin};