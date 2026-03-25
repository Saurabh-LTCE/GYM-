import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Member from './pages/member';
import Trainers from './pages/trainers';
import Fees from './pages/fees';

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav
          style={{
            width: '220px',
            padding: '1rem',
            borderRight: '1px solid #ddd',
          }}
        >
          <h2>Gym Admin</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/members">Members</Link>
            </li>
            <li>
              <Link to="/trainers">Trainers</Link>
            </li>
            <li>
              <Link to="/fees">Fees</Link>
            </li>
          </ul>
        </nav>

        <main style={{ flex: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<Member />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/fees" element={<Fees />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;