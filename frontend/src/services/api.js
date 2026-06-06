import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const complaintApi = {
  generateComplaint: async (description, priority, category) => {
    const response = await api.post('/api/complaints/generate', {
      description,
      priority,
      category,
    });
    return response.data;
  },

  listComplaints: async () => {
    const response = await api.get('/api/complaints');
    return response.data;
  },

  getComplaint: async (id) => {
    const response = await api.get(`/api/complaints/${id}`);
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await api.delete(`/api/complaints/${id}`);
    return response.data;
  },

  getDownloadUrl: (id) => {
    return `${API_URL}/api/complaints/${id}/pdf`;
  },
};

export default api;
