import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconMembers, IconTrainers, IconFees } from './Icons';

const navItems = [
  { to: '/', label: 'Dashboard', end: true, Icon: IconDashboard },
  { to: '/members', label: 'Members', Icon: IconMembers },
  { to: '/trainers', label: 'Trainers', Icon: IconTrainers },
  { to: '/fees', label: 'Fees', Icon: IconFees },
];

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar__header">
      <span className="sidebar__badge">Admin</span>
    </div>
    <nav className="sidebar__nav" aria-label="Main navigation">
      <ul className="sidebar__list">
        {navItems.map(({ to, label, end, Icon }) => (
          <li key={to} className="sidebar__item">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
              }
            >
              <span className="sidebar__link-icon" aria-hidden>
                <Icon />
              </span>
              <span className="sidebar__link-text">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
