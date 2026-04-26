// src/shared/layout/Layout.tsx

import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/layout/Navbar';
import Footer from '../../shared/layout/Footer';
import ScrollToTop from '../components/ui/BackToTopButton'; // ← new
import CTASection from '../components/sections/CTASection'; // ← new


const Layout = () => {
  return (
    <div className="app-wrapper">
      <Navbar />

      {/* Inline styles moved to global.css → .main-content */}
      <main className="main-content">
        <Outlet />
      </main>
      
      <CTASection /> {/* ← directly above Footer on every page */}

      <Footer />
      
      {/* Back to top button sits outside main flow, fixed to viewport */}
      <ScrollToTop />
    </div>
  );
};

export default Layout;
