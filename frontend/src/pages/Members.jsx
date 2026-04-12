import React, { useState } from 'react';
import Table from '../components/Table';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS, membersService } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  membershipType: 'Monthly',
  status: 'Active',
};

const MembersPage = () => {
  const { data, loading, error, refetch } = useFetch(API_PATHS.members);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const rows = Array.isArray(data) ? data : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await membersService.update(editingId, form);
      } else {
        await membersService.create(form);
      }
      setForm(initialForm);
      setEditingId(null);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Could not save member. Check the console.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      name: row.name,
      email: row.email,
      phone: row.phone,
      membershipType: row.membershipType,
      status: row.status,
    });
    setEditingId(row._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await membersService.remove(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Could not delete member.');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'membershipType', header: 'Plan' },
    { key: 'status', header: 'Status' },
    {
      key: 'joinDate',
      header: 'Joined',
      render: (row) =>
        row.joinDate ? new Date(row.joinDate).toLocaleDateString() : '—',
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
              <label htmlFor="m-plan">Membership</label>
              <select
                id="m-plan"
                className="brutal-input"
                name="membershipType"
                value={form.membershipType}
                onChange={handleChange}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="m-status">Status</label>
              <select
                id="m-status"
                className="brutal-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
