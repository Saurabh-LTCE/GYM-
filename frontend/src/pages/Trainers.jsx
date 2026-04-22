import React, { useState } from 'react';
import Table from '../components/Table';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS, trainersService } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  experience: '',
  salary: '',
  assignedMembers: '',
  joiningDate: '',
};

const TrainersPage = () => {
  const { data, loading, error, refetch } = useFetch(API_PATHS.trainers);
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
        experience: form.experience === '' ? 0 : Number(form.experience),
        salary: form.salary === '' ? 0 : Number(form.salary),
        assignedMembers: form.assignedMembers
          ? form.assignedMembers.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        joiningDate: form.joiningDate || undefined,
      };
      if (editingId) {
        await trainersService.update(editingId, payload);
      } else {
        await trainersService.create(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await refetch();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not save trainer.');
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
      experience: row.experience ?? '',
      salary: row.salary ?? '',
      assignedMembers: Array.isArray(row.assignedMembers)
        ? row.assignedMembers
            .map((member) => (typeof member === 'string' ? member : member?._id))
            .filter(Boolean)
            .join(', ')
        : '',
      joiningDate: row.joiningDate ? new Date(row.joiningDate).toISOString().slice(0, 10) : '',
    });
    setEditingId(row._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      await trainersService.remove(id);
      await refetch();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Could not delete trainer.');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'specialization', header: 'Specialization' },
    { key: 'experience', header: 'Experience (yrs)' },
    { key: 'salary', header: 'Salary' },
    {
      key: 'assignedMembers',
      header: 'Assigned Members',
      render: (row) =>
        Array.isArray(row.assignedMembers) ? row.assignedMembers.length : 0,
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
      <h1 className="page-title">Trainers</h1>
      <p className="page-desc">
        Data from <code>GET /api/trainers</code>. Full CRUD against the same API.
      </p>

      {error && (
        <div className="error-banner" role="alert">
          Failed to load trainers.
        </div>
      )}
      {submitError && (
        <div className="error-banner" role="alert">
          {submitError}
        </div>
      )}

      <section className="form-panel brutal-card">
        <h2>{editingId ? 'Edit trainer' : 'Add trainer'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="t-name">Name</label>
              <input
                id="t-name"
                className="brutal-input"
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
                className="brutal-input"
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
                className="brutal-input"
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
                className="brutal-input"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-exp">Experience (years)</label>
              <input
                id="t-exp"
                className="brutal-input"
                type="number"
                min="0"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-salary">Salary</label>
              <input
                id="t-salary"
                className="brutal-input"
                type="number"
                min="0"
                name="salary"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-members">Assigned Member IDs</label>
              <input
                id="t-members"
                className="brutal-input"
                name="assignedMembers"
                value={form.assignedMembers}
                onChange={handleChange}
                placeholder="Comma separated member ObjectIds"
              />
            </div>
            <div className="form-field">
              <label htmlFor="t-joining-date">Joining Date</label>
              <input
                id="t-joining-date"
                className="brutal-input"
                type="date"
                name="joiningDate"
                value={form.joiningDate || ''}
                onChange={handleChange}
              />
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
