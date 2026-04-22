import React, { useEffect } from 'react';
import Card from '../components/Card';
import { IconMembers, IconTrainers, IconFees } from '../components/Icons';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, profile, profileLoading, profileError, loadProfile } = useAuth();
  const membersQ = useFetch(API_PATHS.members);
  const trainersQ = useFetch(API_PATHS.trainers);
  const feesQ = useFetch(API_PATHS.fees);

  useEffect(() => {
    if (!profile && user?.profileId) {
      loadProfile().catch(() => {});
    }
  }, [profile, user, loadProfile]);

  const loading =
    membersQ.loading || trainersQ.loading || feesQ.loading;
  const hasError =
    membersQ.error || trainersQ.error || feesQ.error;

  const memberCount = Array.isArray(membersQ.data) ? membersQ.data.length : 0;
  const trainerCount = Array.isArray(trainersQ.data)
    ? trainersQ.data.length
    : 0;
  const feeCount = Array.isArray(feesQ.data) ? feesQ.data.length : 0;
  const role = user?.role?.toLowerCase();

  const renderRoleProfile = () => {
    if (!user) return null;
    if (profileLoading) {
      return <div className="loading">Loading your profile...</div>;
    }
    if (profileError) {
      return (
        <div className="error-banner" role="alert">
          {profileError}
        </div>
      );
    }
    if (!profile) {
      return (
        <div className="error-banner" role="alert">
          Profile not found for the logged-in user.
        </div>
      );
    }

    if (role === 'member') {
      return (
        <section className="brutal-card" aria-label="Member details">
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone || 'N/A'}</p>
          <p>Age: {profile.age || 'N/A'}</p>
          <p>Gender: {profile.gender || 'N/A'}</p>
          <p>Membership plan: {profile.membershipPlan || 'N/A'}</p>
          <p>Joining date: {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</p>
          <p>Fee status: {profile.feeStatus || 'N/A'}</p>
        </section>
      );
    }

    if (role === 'trainer') {
      return (
        <section className="brutal-card" aria-label="Trainer details">
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone || 'N/A'}</p>
          <p>Specialization: {profile.specialization || 'N/A'}</p>
          <p>Experience: {profile.experience ?? 0} years</p>
          <p>Salary: {profile.salary ?? 0}</p>
          <p>Assigned members: {Array.isArray(profile.assignedMembers) ? profile.assignedMembers.length : 0}</p>
        </section>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-page page-shell">
      <header className="dashboard-page__header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-desc">
          Welcome {user?.name || 'Gym User'}. Your profile data is loaded from MongoDB.
        </p>
      </header>

      {(role === 'member' || role === 'trainer') && renderRoleProfile()}

      {role === 'admin' && loading && (
        <div className="loading" role="status">
          Loading statistics...
        </div>
      )}
      {role === 'admin' && hasError && (
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

      {role === 'admin' && (
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
      )}
    </div>
  );
};

export default Dashboard;
