import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/role-dashboards.css';

const toDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

const MemberDashboard = () => {
  const { user, profile, profileLoading, profileError, loadProfile } = useAuth();
  const [errorMessage, setErrorMessage] = useState(profileError);

  useEffect(() => {
    if (user?.role === 'member' && user?.profileId && !profile) {
      loadProfile().catch((error) =>
        setErrorMessage(error?.response?.data?.message || error?.message)
      );
    }
  }, [user, profile, loadProfile]);

  return (
    <div className="role-dashboard role-dashboard--member">
      <div className="role-dashboard__header">
        <h1>Member Dashboard</h1>
        <p>View your membership details and payment status.</p>
      </div>

      {profileLoading && <div className="role-dashboard__notice">Loading profile...</div>}

      {errorMessage && (
        <div className="role-dashboard__error" role="alert">
          {errorMessage}
        </div>
      )}

      {!profileLoading && !errorMessage && profile && (
        <article className="member-profile-card">
          <h2>{profile.name || 'Member'}</h2>
          <p>
            <strong>Plan:</strong> {profile.membershipPlan || 'N/A'}
          </p>
          <p>
            <strong>Join Date:</strong> {toDate(profile.joiningDate)}
          </p>
          <p>
            <strong>Payment Status:</strong> {profile.feeStatus || 'pending'}
          </p>
        </article>
      )}
    </div>
  );
};

export default MemberDashboard;
