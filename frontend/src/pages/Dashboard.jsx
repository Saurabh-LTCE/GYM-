import React from 'react';
import Card from '../components/Card';
import { IconMembers, IconTrainers, IconFees } from '../components/Icons';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS } from '../services/api';

const Dashboard = () => {
  const membersQ = useFetch(API_PATHS.members);
  const trainersQ = useFetch(API_PATHS.trainers);
  const feesQ = useFetch(API_PATHS.fees);

  const loading =
    membersQ.loading || trainersQ.loading || feesQ.loading;
  const hasError =
    membersQ.error || trainersQ.error || feesQ.error;

  const memberCount = Array.isArray(membersQ.data) ? membersQ.data.length : 0;
  const trainerCount = Array.isArray(trainersQ.data)
    ? trainersQ.data.length
    : 0;
  const feeCount = Array.isArray(feesQ.data) ? feesQ.data.length : 0;

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-desc">
          Quick overview of your gym. Data loads from members, trainers, and
          fees APIs.
        </p>
      </header>

      {loading && (
        <div className="loading" role="status">
          Loading statistics...
        </div>
      )}
      {hasError && (
        <div className="error-banner" role="alert">
          Could not load some data. In production, set{' '}
          <code className="error-banner__code">VITE_API_URL</code> on Vercel to
          your Render API URL. For local dev, use{' '}
          <code className="error-banner__code">VITE_API_URL</code> or{' '}
          <code className="error-banner__code">VITE_DEV_PROXY_TARGET</code>.{' '}
          See <code className="error-banner__code">.env.example</code> for
          examples.
        </div>
      )}

      <section className="stat-grid" aria-label="Summary statistics">
        <Card
          icon={<IconMembers />}
          title="Total Members"
          value={loading ? '-' : memberCount}
          hint="Registered gym members"
          to="/members"
          linkLabel="Manage members"
        />
        <Card
          icon={<IconTrainers />}
          title="Total Trainers"
          value={loading ? '-' : trainerCount}
          hint="Coaching staff"
          to="/trainers"
          linkLabel="Manage trainers"
        />
        <Card
          icon={<IconFees />}
          title="Total Fees"
          value={loading ? '-' : feeCount}
          hint="Fee records in the system"
          to="/fees"
          linkLabel="Manage fees"
        />
      </section>
    </div>
  );
};

export default Dashboard;
