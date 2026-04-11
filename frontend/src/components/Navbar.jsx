import React from 'react';
import { IconGym } from './Icons';

const Navbar = () => (
  <header className="navbar">
    <div className="navbar__inner">
      <div className="navbar__brand">
        <span className="navbar__icon-wrap" aria-hidden>
          <IconGym className="navbar__icon" />
        </span>
        <h1 className="navbar__title">Gym Management</h1>
      </div>
    </div>
  </header>
);

export default Navbar;
