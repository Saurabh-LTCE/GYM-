import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/role-dashboards.css';

const toDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

const TrainerDashboard = () => {
  const { user, profile, profileLoading, loadProfile } = useAuth();
  const [members, setMembers] = useState(profile?.assignedMembers || []);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile?.assignedMembers) {
      setMembers(profile.assignedMembers);
      return;
    }

    if (user?.role === 'trainer' && user?.profileId) {
      loadProfile()
        .then((loaded) => {
          setMembers(Array.isArray(loaded?.assignedMembers) ? loaded.assignedMembers : []);
        })
        .catch((error) => {
          setErrorMessage(
            error?.response?.data?.message ||
              error?.message ||
              'Could not load assigned members.'
          );
        });
    }
  }, [user, profile, loadProfile]);

  return (
    <div className="role-dashboard role-dashboard--trainer">
      <div className="role-dashboard__header">
        <h1>Trainer Dashboard</h1>
        <p>Track your assigned members and their active plans.</p>
      </div>

      {profileLoading && <div className="role-dashboard__notice">Loading members...</div>}

      {errorMessage && (
        <div className="role-dashboard__error" role="alert">
          {errorMessage}
        </div>
      )}

      {!profileLoading && !errorMessage && (
        <div className="trainer-member-grid">
          {members.length === 0 && (
            <div className="role-dashboard__notice">No members assigned yet.</div>
          )}
          {members.map((member) => (
            <article
              className="trainer-member-card"
              key={member._id || member.id || member.email}
            >
              <h3>{member.name || 'Unnamed Member'}</h3>
              <p>
                <strong>Plan:</strong> {member.plan || member.membershipType || 'N/A'}
              </p>
              <p>
                <strong>Expiry Date:</strong> {toDate(member.expiryDate)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
