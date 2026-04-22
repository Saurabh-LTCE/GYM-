import React, { useState } from 'react';
import Table from '../components/Table';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS, membersService } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: 'prefer_not_to_say',
  membershipPlan: 'basic',
  joiningDate: '',
  assignedTrainer: '',
  feeStatus: 'pending',
};

const MembersPage = () => {
  const { data, loading, error, refetch } = useFetch(API_PATHS.members);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const rows = Array.isArray(data) ? data : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError('');
    try {
      const payload = {
        ...form,
        age: form.age === '' ? null : Number(form.age),
        assignedTrainer: form.assignedTrainer || null,
        joiningDate: form.joiningDate || undefined,
      };
      if (editingId) {
        await membersService.update(editingId, payload);
      } else {
        await membersService.create(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await refetch();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not save member.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      name: row.name,
      email: row.email,
      phone: row.phone,
      age: row.age ?? '',
      gender: row.gender || 'prefer_not_to_say',
      membershipPlan: row.membershipPlan || 'basic',
      joiningDate: row.joiningDate ? new Date(row.joiningDate).toISOString().slice(0, 10) : '',
      assignedTrainer: row.assignedTrainer?._id || row.assignedTrainer || '',
      feeStatus: row.feeStatus || 'pending',
    });
    setEditingId(row._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await membersService.remove(id);
      await refetch();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not delete member.');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'membershipPlan', header: 'Plan' },
    { key: 'feeStatus', header: 'Fee Status' },
    {
      key: 'joiningDate',
      header: 'Joined',
      render: (row) =>
        row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : '—',
    },
    {
      key: '_actions',
      header: 'Actions',
      render: (row) => (
        <div className="form-actions">
          <button
            type="button"
            className="brutal-button brutal-button--ghost brutal-button--sm"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            type="button"
            className="brutal-button brutal-button--danger brutal-button--sm"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <h1 className="page-title">Members</h1>
      <p className="page-desc">
        Loaded with <code>GET /api/members</code>. Add, edit, or remove records.
      </p>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load members. Is the backend running?
        </div>
      )}
      {submitError && (
        <div className="error-banner" role="alert">
          {submitError}
        </div>
      )}

      <section className="form-panel brutal-card">
        <h2>{editingId ? 'Edit member' : 'Add member'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="m-name">Name</label>
              <input
                id="m-name"
                className="brutal-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-email">Email</label>
              <input
                id="m-email"
                className="brutal-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-phone">Phone</label>
              <input
                id="m-phone"
                className="brutal-input"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-age">Age</label>
              <input
                id="m-age"
                className="brutal-input"
                type="number"
                min="0"
                name="age"
                value={form.age}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-gender">Gender</label>
              <select
                id="m-gender"
                className="brutal-input"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="m-plan">Membership</label>
              <select
                id="m-plan"
                className="brutal-input"
                name="membershipPlan"
                value={form.membershipPlan}
                onChange={handleChange}
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="m-joining-date">Joining Date</label>
              <input
                id="m-joining-date"
                className="brutal-input"
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-trainer-id">Assigned Trainer ID</label>
              <input
                id="m-trainer-id"
                className="brutal-input"
                name="assignedTrainer"
                value={form.assignedTrainer}
                onChange={handleChange}
                placeholder="Optional trainer ObjectId"
              />
            </div>
            <div className="form-field">
              <label htmlFor="m-fee-status">Fee Status</label>
              <select
                id="m-fee-status"
                className="brutal-input"
                name="feeStatus"
                value={form.feeStatus}
                onChange={handleChange}
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="brutal-button brutal-button--primary"
              disabled={saving}
            >
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                className="brutal-button brutal-button--ghost"
                onClick={() => {
                  setForm(initialForm);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {loading ? (
        <div className="loading">Loading members…</div>
      ) : (
        <Table
          columns={columns}
          data={rows}
          emptyMessage="No members yet. Add one above."
        />
      )}
    </div>
  );
};

export default MembersPage;
