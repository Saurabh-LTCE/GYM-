import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  membershipType: 'Monthly',
  status: 'Active',
};

const Member = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/members`);
      setMembers(res.data);
    } catch (error) {
      console.error('Error fetching members', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `${API_BASE_URL}/api/members/${editingId}`,
          form
        );
        setMembers((prev) =>
          prev.map((m) => (m._id === editingId ? res.data : m))
        );
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/api/members`,
          form
        );
        setMembers((prev) => [res.data, ...prev]);
      }
      setForm(initialFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving member', error);
    }
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      status: member.status,
    });
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/members/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Error deleting member', error);
    }
  };

  return (
    <div>
      <h1>Members</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <h2>{editingId ? 'Edit Member' : 'Add Member'}</h2>
        <div>
          <label>
            Name:{' '}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:{' '}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone:{' '}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Membership Type:{' '}
            <select
              name="membershipType"
              value={form.membershipType}
              onChange={handleChange}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <button type="submit">
          {editingId ? 'Update Member' : 'Add Member'}
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
        <div>Loading members...</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership Type</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{m.membershipType}</td>
                <td>{m.status}</td>
                <td>{m.joinDate ? new Date(m.joinDate).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(m)}>Edit</button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="7">No members found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Member;