import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import '../styles/role-dashboards.css';

const toDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

const MemberDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const data = await authService.getMemberProfile();
        setProfile(data?.member || data?.user || data);
      } catch (error) {
        setErrorMessage(
          error?.response?.data?.message ||
            error?.message ||
            'Could not load member details.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="role-dashboard role-dashboard--member">
      <div className="role-dashboard__header">
        <h1>Member Dashboard</h1>
        <p>View your membership details and payment status.</p>
      </div>

      {loading && <div className="role-dashboard__notice">Loading profile...</div>}

      {errorMessage && (
        <div className="role-dashboard__error" role="alert">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && profile && (
        <article className="member-profile-card">
          <h2>{profile.name || 'Member'}</h2>
          <p>
            <strong>Plan:</strong> {profile.plan || profile.membershipType || 'N/A'}
          </p>
          <p>
            <strong>Join Date:</strong> {toDate(profile.joinDate)}
          </p>
          <p>
            <strong>Expiry Date:</strong> {toDate(profile.expiryDate)}
          </p>
          <p>
            <strong>Payment Status:</strong> {profile.paymentStatus || 'Pending'}
          </p>
        </article>
      )}
    </div>
  );
};

export default MemberDashboard;
