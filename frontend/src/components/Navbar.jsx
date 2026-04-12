import dumbelIcon from "../assets/icons/Dumbelicon.png";
import React from 'react';

const Navbar = () => (
  <header className="navbar">
    <div className="navbar__inner">
      <div className="navbar__brand">
        
        <span className="w-12 h-12 flex items-center justify-center border-2 border-black bg-white shadow-[4px_4px_0px_black]">
          <img 
            src={dumbelIcon} 
            alt="gym icon"
            className="navbar__icon"
          />
        </span>

        <h1 className="navbar__title">Gym Management</h1>

      </div>
    </div>
  </header>
);

export default Navbar;