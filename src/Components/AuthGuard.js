import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { LoginScreen } from './LoginScreen';
import { RoutePaths } from '../router/types';

const AuthGuard = ({ children }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user.info && (!user.profiles || user.profiles.length === 0)) {
      navigate(RoutePaths.Profiles);
      return;
    }
  }, [user.info, Boolean(user.profiles?.length), location.pathname, navigate]);

  if (!user.info) {
    return <LoginScreen />;
  }

  return children;
};

export default AuthGuard;