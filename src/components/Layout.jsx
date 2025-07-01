import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-20 pt-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;