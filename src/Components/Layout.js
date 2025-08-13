import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Nav } from './Nav';
import { routes } from '../router/routes';

const Layout = () => {
  const element = useRoutes(routes);

  return (
    <>
      <Nav />
      { element }
    </>
  );
};

export default Layout;
