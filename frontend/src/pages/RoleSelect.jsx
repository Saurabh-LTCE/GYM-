import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const ROLES = [
  { label: 'Admin', value: 'admin', colorClass: 'role-btn--yellow' },
  { label: 'Trainer', value: 'trainer', colorClass: 'role-btn--blue' },
  { label: 'Member', value: 'member', colorClass: 'role-btn--pink' },
];

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem('selected_role', role);
    navigate('/login');
  };

  return (
    <div className="auth-screen">
      <section className="auth-card role-card">
        <p className="auth-chip">Choose your role</p>
        <h1>Gym Management System</h1>
        <p className="auth-subtitle">Select your role before authentication</p>
        <div className="role-grid">
          {ROLES.map((role) => (
            <button
              key={role.value}
              type="button"
              className={`role-btn ${role.colorClass}`}
              onClick={() => handleRoleSelect(role.value)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RoleSelect;
