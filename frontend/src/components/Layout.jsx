import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => (
  <div className="app-shell">
    <Sidebar />
    <div className="app-shell__main-wrap">
      <Navbar />
      <main className="app-shell__main">
        <div className="app-shell__inner">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default Layout;
