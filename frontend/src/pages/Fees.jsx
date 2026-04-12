import React, { useState, useMemo } from 'react';
import Table from '../components/Table';
import { useFetch } from '../hooks/useFetch';
import { API_PATHS, feesService } from '../services/api';

const initialForm = {
  member: '',
  amount: '',
  status: 'Pending',
  dueDate: '',
  paidOn: '',
};

const FeesPage = () => {
  const feesQ = useFetch(API_PATHS.fees);
  const membersQ = useFetch(API_PATHS.members);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const feeRows = Array.isArray(feesQ.data) ? feesQ.data : [];
  const memberOptions = useMemo(
    () => (Array.isArray(membersQ.data) ? membersQ.data : []),
    [membersQ.data]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const refreshAll = async () => {
    await Promise.all([feesQ.refetch(), membersQ.refetch()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member) {
      alert('Please select a member.');
      return;
    }
    setSaving(true);
    const payload = {
      member: form.member,
      amount: Number(form.amount),
      status: form.status,
      dueDate: form.dueDate || undefined,
      paidOn: form.paidOn || undefined,
    };
    try {
      if (editingId) {
        await feesService.update(editingId, payload);
      } else {
        await feesService.create(payload);
      }
      setForm(initialForm);
      setEditingId(null);
      await refreshAll();
    } catch (err) {
      console.error(err);
      alert('Could not save fee record.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setForm({
      member: row.member?._id || row.member || '',
      amount: row.amount,
      status: row.status,
      dueDate: row.dueDate ? String(row.dueDate).slice(0, 10) : '',
      paidOn: row.paidOn ? String(row.paidOn).slice(0, 10) : '',
    });
    setEditingId(row._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this fee record?')) return;
    try {
      await feesService.remove(id);
      await feesQ.refetch();
    } catch (err) {
      console.error(err);
      alert('Could not delete fee.');
    }
  };

  const loading = feesQ.loading || membersQ.loading;
  const listError = feesQ.error || membersQ.error;

  const columns = [
    {
      key: 'member',
      header: 'Member',
      render: (row) => {
        const m = row.member;
        if (m && typeof m === 'object') {
          return `${m.name ?? ''} (${m.email ?? ''})`.trim() || '—';
        }
        return m || '—';
      },
    },
    { key: 'amount', header: 'Amount' },
    { key: 'status', header: 'Status' },
    {
      key: 'dueDate',
      header: 'Due',
      render: (row) =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '—',
    },
    {
      key: 'paidOn',
      header: 'Paid on',
      render: (row) =>
        row.paidOn ? new Date(row.paidOn).toLocaleDateString() : '—',
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
      <h1 className="page-title">Fees</h1>
      <p className="page-desc">
        List from <code>GET /api/fees</code>. Members load from{' '}
        <code>GET /api/members</code> for the dropdown.
      </p>

      {listError && (
        <div className="error-banner" role="alert">
          Failed to load data. Check API and CORS.
        </div>
      )}

      <section className="form-panel brutal-card">
        <h2>{editingId ? 'Edit fee' : 'Add fee'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="f-member">Member</label>
              <select
                id="f-member"
                className="brutal-input"
                name="member"
                value={form.member}
                onChange={handleChange}
                required
              >
                <option value="">Select member</option>
                {memberOptions.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} — {m.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="f-amount">Amount</label>
              <input
                id="f-amount"
                className="brutal-input"
                type="number"
                min="0"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="f-status">Status</label>
              <select
                id="f-status"
                className="brutal-input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="f-due">Due date</label>
              <input
                id="f-due"
                className="brutal-input"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="f-paid">Paid on</label>
              <input
                id="f-paid"
                className="brutal-input"
                type="date"
                name="paidOn"
                value={form.paidOn}
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
        <div className="loading">Loading fees…</div>
      ) : (
        <Table
          columns={columns}
          data={feeRows}
          emptyMessage="No fee records. Create members first if the list is empty."
        />
      )}
    </div>
  );
};

export default FeesPage;
