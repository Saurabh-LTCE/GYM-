import axios from 'axios';

/**
 * Axios instance for the Gym Management backend.
 * Base URL comes from Vite env (configure in .env as VITE_API_BASE_URL).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Resource paths — backend uses /api/* */
export const API_PATHS = {
  members: '/api/members',
  trainers: '/api/trainers',
  fees: '/api/fees',
};

export const membersService = {
  getAll: () => api.get(API_PATHS.members).then((res) => res.data),
  create: (body) => api.post(API_PATHS.members, body).then((res) => res.data),
  update: (id, body) =>
    api.put(`${API_PATHS.members}/${id}`, body).then((res) => res.data),
  remove: (id) => api.delete(`${API_PATHS.members}/${id}`).then((res) => res.data),
};

export const trainersService = {
  getAll: () => api.get(API_PATHS.trainers).then((res) => res.data),
  create: (body) => api.post(API_PATHS.trainers, body).then((res) => res.data),
  update: (id, body) =>
    api.put(`${API_PATHS.trainers}/${id}`, body).then((res) => res.data),
  remove: (id) =>
    api.delete(`${API_PATHS.trainers}/${id}`).then((res) => res.data),
};

export const feesService = {
  getAll: () => api.get(API_PATHS.fees).then((res) => res.data),
  create: (body) => api.post(API_PATHS.fees, body).then((res) => res.data),
  update: (id, body) =>
    api.put(`${API_PATHS.fees}/${id}`, body).then((res) => res.data),
  remove: (id) => api.delete(`${API_PATHS.fees}/${id}`).then((res) => res.data),
};

export default api;
