import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Members from '../pages/Members.jsx';
import Trainers from '../pages/Trainers.jsx';
import Fees from '../pages/Fees.jsx';
import RoleSelect from '../pages/RoleSelect.jsx';
import Login from '../pages/Login.jsx';
import TrainerDashboard from '../pages/TrainerDashboard.jsx';
import MemberDashboard from '../pages/MemberDashboard.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/role-select" replace />} />
    <Route path="/role-select" element={<RoleSelect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
    <Route path="/member-dashboard" element={<MemberDashboard />} />
    <Route element={<Layout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/members" element={<Members />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/fees" element={<Fees />} />
    </Route>
  </Routes>
);

export default AppRoutes;
