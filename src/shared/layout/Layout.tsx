// src/shared/layout/Layout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/layout/Navbar';
import Footer from '../../shared/layout/Footer';

const Layout = () => {
  return (
    <div className="app-wrapper">
      <Navbar />

      {/* Inline styles moved to global.css → .main-content */}
      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
