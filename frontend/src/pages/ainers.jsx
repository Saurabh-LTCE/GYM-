import React, { useState } from 'react';
import Table from '../components/Table';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS, trainersService } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  status: 'Active',
};

const TrainersPage = () => {
  const { data, loading, error, refetch } = useFetch(API_PATHS.trainers);
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
        await trainersService.update(editingId, form);
      } else {
        await trainersService.create(form);
      }
      setForm(initialForm);
      setEditingId(null);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Could not save trainer.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      name: row.name,
      email: row.email,
      phone: row.phone,
      specialization: row.specialization,
      status: row.status,
    });
    setEditingId(row._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      await trainersService.remove(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Could not delete trainer.');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'status', header: 'Status' },
    {
      key: 'joinedOn',
      header: 'Joined',
      render: (row) =>
        row.joinedOn ? new Date(row.joinedOn).toLocaleDateString() : '—',
    },
    {
      key: '_actions',
      header: 'Actions',
      render: (row) => (
        <div className="form-actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="page-title">Trainers</h1>
      <p className="page-desc">
        Data from <code>GET /api/trainers</code>. Full CRUD against the same API.
      </p>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load trainers.
        </div>
      )}

      <section className="form-panel">
        <h2>{editingId ? 'Edit trainer' : 'Add trainer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="t-name">Name</label>
              <input
                id="t-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-email">Email</label>
              <input
                id="t-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-phone">Phone</label>
              <input
                id="t-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-spec">Specialization</label>
              <input
                id="t-spec"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-status">Status</label>
              <select
                id="t-status"
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
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn--ghost"
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
        <div className="loading">Loading trainers…</div>
      ) : (
        <Table
          columns={columns}
          data={rows}
          emptyMessage="No trainers yet."
        />
      )}
    </div>
  );
};

export default TrainersPage;
