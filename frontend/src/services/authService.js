import api from './api';

export const authService = {
  firebaseLogin: async ({ name, email, uid, role }) => {
    const response = await api.post('/api/auth/firebase', { name, email, uid, role });
    return response.data;
  },
  getTrainerById: async (id) => {
    const response = await api.get(`/api/trainers/${id}`);
    return response.data;
  },
  getMemberById: async (id) => {
    const response = await api.get(`/api/members/${id}`);
    return response.data;
  },
};
