import React, { createContext, useState, useContext, useEffect } from 'react';
import { complaintApi } from '../services/api';

const ComplaintContext = createContext();

// Elegant mock letters for default/offline experience
const mockLetters = [
  {
    id: 'mock-1',
    title: 'Faulty Smartphone Screen & Battery Drain',
    description: 'The phone screen flickers constantly, and the battery drains from 100% to 0% in less than 2 hours. Support has refused to replace it.',
    priority: 'high',
    category: 'Product',
    letter_text: `John Doe\n123 Maple Street\nSpringfield, IL 62701\njohndoe@email.com\n\nJune 6, 2026\n\nCustomer Relations Dept.\nVolt Electronics Inc.\n456 Tech Boulevard\nSan Jose, CA 95131\n\nSubject: Formal Complaint - Defective Screen and Battery on Volt X20\n\nDear Director of Customer Relations,\n\nI am writing to formally log a complaint regarding my recent purchase of the Volt X20 smartphone, purchased on May 10, 2026. \n\nFrom the first week of usage, the device screen has exhibited severe, persistent flickering. Furthermore, the battery experiences critical degradation, draining from a full charge to zero in under two hours of minimal use. I contacted your support line on May 15, and was told this did not qualify for a replacement, which is unacceptable under consumer protection guidelines.\n\nThis is a HIGH priority issue as the device is essential for my daily work and safety. I request a complete replacement of the unit or a full refund immediately.\n\nSincerely,\nJohn Doe`,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Double Billing on Premium Subscription',
    description: 'I was charged twice for the monthly subscription in May. I raised a ticket but got no reply.',
    priority: 'medium',
    category: 'Billing',
    letter_text: `Jane Smith\n789 Oak Lane\nAustin, TX 78701\njanesmith@email.com\n\nJune 5, 2026\n\nBilling Department\nStreamFlow Media Inc.\n101 Entertainment Way\nLos Angeles, CA 90028\n\nSubject: Billing Discrepancy - Unresolved Double Charge\n\nDear Billing Team,\n\nI am writing to request a refund for a double charge on my account (ID: sf-99218). For the billing cycle of May 2026, my credit card was charged $19.99 twice instead of once. \n\nI created support ticket #88127 on May 3rd, but have received no follow-up. This is a MEDIUM priority dispute. I expect a prompt reversal of the duplicate charge to my card.\n\nSincerely,\nJane Smith`,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(mockLetters);
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await complaintApi.listComplaints();
      if (data && data.length > 0) {
        setComplaints(data);
      } else {
        // Fallback to mock if database is empty
        setComplaints(mockLetters);
      }
      setError(null);
    } catch (err) {
      console.warn("Backend offline, using local mock data:", err);
      // Keep mock data in case backend is offline
    } finally {
      setIsLoading(false);
    }
  };

  const generateComplaint = async (description, priority, category) => {
    try {
      setIsLoading(true);
      setError(null);
      const newLetter = await complaintApi.generateComplaint(description, priority, category);
      setComplaints(prev => [newLetter, ...prev]);
      setCurrentComplaint(newLetter);
      return newLetter;
    } catch (err) {
      console.error("Error generating complaint, generating local fallback:", err);
      // Create local fallback using template if backend fails or API key not set
      const fallbackId = 'local-' + Date.now();
      const mockResult = {
        id: fallbackId,
        title: `Complaint regarding ${category || 'Service'}`,
        description,
        priority,
        category,
        letter_text: `[Your Name]\n[Your Address]\n[Your Contact Info]\n\n${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n[Recipient Name/Company]\n[Recipient Address]\n\nSubject: Formal Complaint - ${category || 'Service Issue'}\n\nDear Customer Support,\n\nI am writing to formally log a complaint regarding the following issue:\n\n${description}\n\nThis matter is of ${priority.toUpperCase()} priority to me. I expect a quick and professional response resolving this issue.\n\nSincerely,\n[Your Name]`,
        created_at: new Date().toISOString()
      };
      setComplaints(prev => [mockResult, ...prev]);
      setCurrentComplaint(mockResult);
      return mockResult;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      setIsLoading(true);
      await complaintApi.deleteComplaint(id);
      setComplaints(prev => prev.filter(c => c.id !== id));
      if (currentComplaint?.id === id) {
        setCurrentComplaint(null);
      }
    } catch (err) {
      console.warn("Backend delete failed, performing local delete:", err);
      setComplaints(prev => prev.filter(c => c.id !== id));
      if (currentComplaint?.id === id) {
        setCurrentComplaint(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <ComplaintContext.Provider value={{
      complaints,
      currentComplaint,
      setCurrentComplaint,
      isLoading,
      error,
      generateComplaint,
      fetchComplaints,
      deleteComplaint
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
