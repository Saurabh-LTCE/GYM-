import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    members: 0,
    trainers: 0,
    fees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [trainersRes, feesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/trainers`),
          axios.get(`${API_BASE_URL}/api/fees`),
        ]);

        setSummary({
          members: 0, // Members page/file is not present yet
          trainers: trainersRes.data.length,
          fees: feesRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard summary', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Gym Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h2>Trainers</h2>
          <p>Total: {summary.trainers}</p>
          <Link to="/trainers">View Trainers</Link>
        </div>
        <div>
          <h2>Fees</h2>
          <p>Total Records: {summary.fees}</p>
          <Link to="/fees">View Fees</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;