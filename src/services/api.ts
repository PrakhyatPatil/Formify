import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface ComplaintResponse {
  id: string;
  department: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  subject: string;
  location: string;
  formalBody: string;
  urgencyReason: string;
  studentName: string;
  originalText: string;
  dateSubmitted: string;
  status: 'Pending' | 'Submitted';
}

export const convertHinglishToFormal = async (text: string, studentName?: string, category?: string, priority?: string): Promise<ComplaintResponse> => {
  const response = await api.post<ComplaintResponse>('/api/complaint', { text, studentName, category, priority });
  return response.data;
};

export const transcribeAudio = async (audioBlob: Blob): Promise<{ transcript: string }> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice_input.webm');
  
  const response = await api.post<{ transcript: string }>('/api/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPdfDownloadUrl = (complaintId: string): string => {
  return `${API_BASE_URL}/api/pdf/${complaintId}`;
};

export default api;
