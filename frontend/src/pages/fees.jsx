import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialFormState = {
  member: '',
  amount: '',
  status: 'Pending',
  dueDate: '',
  paidOn: '',
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [feesRes /*, membersRes */] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/fees`),
        // Members endpoint not wired in frontend structure yet
      ]);
      setFees(feesRes.data);
      setMembers([]); // Placeholder until members page/file exists
    } catch (error) {
      console.error('Error fetching fees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      member: form.member || undefined,
      amount: Number(form.amount),
      status: form.status,
      dueDate: form.dueDate || undefined,
      paidOn: form.paidOn || undefined,
    };

    try {
      if (editingId) {
        const res = await axios.put(
          `${API_BASE_URL}/api/fees/${editingId}`,
          payload
        );
        setFees((prev) =>
          prev.map((f) => (f._id === editingId ? res.data : f))
        );
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/api/fees`,
          payload
        );
        setFees((prev) => [res.data, ...prev]);
      }
      setForm(initialFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving fee', error);
    }
  };

  const handleEdit = (fee) => {
    setForm({
      member: fee.member?._id || '',
      amount: fee.amount,
      status: fee.status,
      dueDate: fee.dueDate ? fee.dueDate.slice(0, 10) : '',
      paidOn: fee.paidOn ? fee.paidOn.slice(0, 10) : '',
    });
    setEditingId(fee._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/fees/${id}`);
      setFees((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error('Error deleting fee', error);
    }
  };

  return (
    <div>
      <h1>Fees</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <h2>{editingId ? 'Edit Fee Record' : 'Add Fee Record'}</h2>
        <div>
          <label>
            Member (ID):{' '}
            <input
              name="member"
              value={form.member}
              onChange={handleChange}
              placeholder="Member ObjectId"
            />
          </label>
        </div>
        <div>
          <label>
            Amount:{' '}
            <input
              type="number"
              min="0"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Status:{' '}
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Due Date:{' '}
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Paid On:{' '}
            <input
              type="date"
              name="paidOn"
              value={form.paidOn}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">
          {editingId ? 'Update Fee' : 'Add Fee'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm(initialFormState);
              setEditingId(null);
            }}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <div>Loading fees...</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Member</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Paid On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f._id}>
                <td>
                  {f.member
                    ? `${f.member.name || f.member} `
                    : 'N/A'}
                </td>
                <td>{f.amount}</td>
                <td>{f.status}</td>
                <td>{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '-'}</td>
                <td>{f.paidOn ? new Date(f.paidOn).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(f)}>Edit</button>
                  <button
                    onClick={() => handleDelete(f._id)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {fees.length === 0 && (
              <tr>
                <td colSpan="6">No fee records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Fees;