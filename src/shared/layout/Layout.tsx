import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="container" style={{ minHeight: '80vh', padding: '50px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;