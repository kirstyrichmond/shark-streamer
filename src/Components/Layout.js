import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { Nav } from './Nav';

const Layout = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user.info && location.pathname !== '/') {
      navigate('/');
    }
  }, [user.info, location.pathname, navigate]);

  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default Layout;
