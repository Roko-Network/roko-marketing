import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from './Layout';

/**
 * RootLayout Component
 *
 * Root layout wrapper that uses the main Layout component with outlet for routing.
 * This provides the consistent site-wide layout structure.
 */
const RootLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default RootLayout;