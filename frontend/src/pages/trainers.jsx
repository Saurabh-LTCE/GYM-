import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  status: 'Active',
};

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/trainers`);
      setTrainers(res.data);
    } catch (error) {
      console.error('Error fetching trainers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
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
          `${API_BASE_URL}/api/trainers/${editingId}`,
          form
        );
        setTrainers((prev) =>
          prev.map((t) => (t._id === editingId ? res.data : t))
        );
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/api/trainers`,
          form
        );
        setTrainers((prev) => [res.data, ...prev]);
      }
      setForm(initialFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving trainer', error);
    }
  };

  const handleEdit = (trainer) => {
    setForm({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialization: trainer.specialization,
      status: trainer.status,
    });
    setEditingId(trainer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/trainers/${id}`);
      setTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting trainer', error);
    }
  };

  return (
    <div>
      <h1>Trainers</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <h2>{editingId ? 'Edit Trainer' : 'Add Trainer'}</h2>
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
            Specialization:{' '}
            <input
              name="specialization"
              value={form.specialization}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
        <button type="submit">
          {editingId ? 'Update Trainer' : 'Add Trainer'}
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
        <div>Loading trainers...</div>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td>{t.specialization}</td>
                <td>{t.status}</td>
                <td>{t.joinedOn ? new Date(t.joinedOn).toLocaleDateString() : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {trainers.length === 0 && (
              <tr>
                <td colSpan="7">No trainers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Trainers;