import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard.jsx';
import Members from '../pages/Members.jsx';
import Trainers from '../pages/Trainers.jsx';
import Fees from '../pages/Fees.jsx';

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/members" element={<Members />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="/fees" element={<Fees />} />
    </Route>
  </Routes>
);

export default AppRoutes;
