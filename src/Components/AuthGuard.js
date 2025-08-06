import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { LoginScreen } from './LoginScreen';

const AuthGuard = ({ children }) => {
  const user = useSelector(selectUser);
  
  if (!user.info) {
    return <LoginScreen />;
  }
  
  return children;
};

export default AuthGuard;