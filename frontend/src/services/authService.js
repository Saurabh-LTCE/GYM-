import api from './api';

export const authService = {
  firebaseLogin: async ({ name, email, uid, role }) => {
    const response = await api.post('/api/auth/firebase', { name, email, uid, role });
    return response.data;
  },
  getTrainerMembers: async () => {
    const endpoints = ['/api/trainers/me/members', '/api/trainers/assigned-members'];
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
    }
    throw new Error('Could not load trainer members from configured endpoints.');
  },
  getMemberProfile: async () => {
    const endpoints = ['/api/members/me', '/api/users/me'];
    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
    }
    throw new Error('Could not load member profile from configured endpoints.');
  },
};
