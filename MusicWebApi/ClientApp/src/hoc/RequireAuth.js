import { Navigate } from 'react-router-dom';

const RequireAuth = ({children}) => {
    const isAuth = localStorage.getItem('isAuth');

    if (!isAuth) {
        return <Navigate to='/' />
    }

  return children;
}

export {RequireAuth};