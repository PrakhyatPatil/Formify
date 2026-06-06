import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { convertHinglishToFormal, ComplaintResponse } from '../services/api';

export interface Complaint {
  id: string;
  originalText: string;
  department: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  subject: string;
  location: string;
  formalBody: string;
  urgencyReason: string;
  dateSubmitted: string;
  status: 'Pending' | 'Submitted';
  studentName: string;
}

export interface StudentProfile {
  fullName: string;
  rollNumber: string;
  blockRoom: string;
  department: string;
  email: string;
  isLoggedIn: boolean;
}

interface State {
  complaints: Complaint[];
  activeComplaint: Complaint | null;
  loading: boolean;
  error: string | null;
  studentProfile: StudentProfile;
}

type Action =
  | { type: 'ADD_COMPLAINT'; payload: Complaint }
  | { type: 'SET_ACTIVE_COMPLAINT'; payload: Complaint | null }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: 'Pending' | 'Submitted' } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'DELETE_COMPLAINT'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: StudentProfile }
  | { type: 'LOGOUT' };

const defaultProfile: StudentProfile = {
  fullName: 'Rahul Kumar',
  rollNumber: 'INC/2024/7012',
  blockRoom: 'Hostel Block D, Room 204',
  department: 'Computer Science & Engineering',
  email: 'rahul.kumar24@college.edu',
  isLoggedIn: true,
};

const getStoredProfile = (): StudentProfile => {
  try {
    const stored = localStorage.getItem('formify_student_profile');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading profile from localStorage:', e);
  }
  return defaultProfile;
};

const initialState: State = {
  complaints: [
    {
      id: 'demo-1',
      studentName: 'Rahul Kumar',
      originalText: 'sir mera hostel ka AC kharab hai 3 din se room 204 mein, Warden ko complaint kar di par kuch nahi hua.',
      department: 'Hostel Maintenance',
      priority: 'HIGH',
      subject: 'Hostel Room 204 Air Conditioner Malfunction',
      location: 'Hostel Room 204',
      formalBody: 'I am writing to formally complain regarding the non-functional air conditioning unit in hostel Room 204, which has not been operational for the last three days. Despite an informal verbal complaint raised to the hostel floor warden, no rectification actions have been initiated. Given the prevailing heat conditions, it is extremely difficult to sustain academic and basic living conditions inside the room.',
      urgencyReason: 'Extreme heat and non-functional ventilation poses health and academic focus hazards.',
      dateSubmitted: '2026-06-03',
      status: 'Pending'
    },
    {
      id: 'demo-2',
      studentName: 'Rahul Kumar',
      originalText: 'library mein mera laptop chori ho gaya aaj subah, table pe rakh ke washroom gaya tha.',
      department: 'Security',
      priority: 'HIGH',
      subject: 'Theft of Laptop from Central Library Premises',
      location: 'Central Library',
      formalBody: 'This is to report a grave security lapse concerning the theft of my personal laptop from the Central Library premises earlier this morning. I had temporarily left my laptop on the reading table near cabin 4 to visit the restroom, and digital camera logs must be inspected. Upon my return within ten minutes, the device was missing. I request immediate inspection of the library entrance CCTV footage and registration of an official security inquiry.',
      urgencyReason: 'Losing an active laptop causes severe academic theft emergency and immediate need for security footage review.',
      dateSubmitted: '2026-06-04',
      status: 'Submitted'
    },
    {
      id: 'demo-3',
      studentName: 'Rahul Kumar',
      originalText: 'College website pe result nahi dikh raha server down hai fees pay karne pe white screen aa jati hai',
      department: 'IT Support',
      priority: 'HIGH',
      subject: 'College Portal Server Outage During Registration',
      location: 'College Portal Service',
      formalBody: 'I am writing to report a critical technical outage on the official college website and portal services. Currently, students are unable to view academic results, and attempts to process examination fees are leading to an unstable white screen. This server failure is preventing timely registration and risking late fee implications.',
      urgencyReason: 'Prevents critical administrative transactions and examination result checking.',
      dateSubmitted: '2026-06-05',
      status: 'Pending'
    },
    {
      id: 'demo-4',
      studentName: 'Rahul Kumar',
      originalText: 'internship NOC chahiye next week tak, company ne deadline de rakhi hai.',
      department: 'Academic Office',
      priority: 'MEDIUM',
      subject: 'Urgent Request for Internship No Objection Certificate (NOC)',
      location: 'Academic Office Annex',
      formalBody: 'I request you to kindly facilitate the issuance of a No Objection Certificate (NOC) for my upcoming summer internship. The hiring company has specified a strict submission deadline of next week, failing which the internship offer stands rescinded. All my academic records are clear, and I have completed the preliminary clearance details.',
      urgencyReason: 'Recruitment onboarding deadline is next week, posing threat of offer withdrawal.',
      dateSubmitted: '2026-06-05',
      status: 'Submitted'
    }
  ],
  activeComplaint: null,
  loading: false,
  error: null,
  studentProfile: getStoredProfile(),
};

function complaintReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_COMPLAINT':
      return {
        ...state,
        complaints: [action.payload, ...state.complaints],
        activeComplaint: action.payload,
        error: null,
      };
    case 'SET_ACTIVE_COMPLAINT':
      return {
        ...state,
        activeComplaint: action.payload,
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        complaints: state.complaints.map((c) =>
          c.id === action.payload.id ? { ...c, status: action.payload.status } : c
        ),
        activeComplaint:
          state.activeComplaint && state.activeComplaint.id === action.payload.id
            ? { ...state.activeComplaint, status: action.payload.status }
            : state.activeComplaint,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'DELETE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.filter((c) => c.id !== action.payload),
        activeComplaint:
          state.activeComplaint && state.activeComplaint.id === action.payload
            ? null
            : state.activeComplaint,
      };
    case 'UPDATE_PROFILE':
      try {
        localStorage.setItem('formify_student_profile', JSON.stringify(action.payload));
      } catch (e) {
        console.error(e);
      }
      return {
        ...state,
        studentProfile: action.payload,
      };
    case 'LOGOUT':
      const loggedOutProfile = { ...state.studentProfile, isLoggedIn: false };
      try {
        localStorage.setItem('formify_student_profile', JSON.stringify(loggedOutProfile));
      } catch (e) {
        console.error(e);
      }
      return {
        ...state,
        studentProfile: loggedOutProfile,
      };
    default:
      return state;
  }
}

interface ComplaintContextProps {
  state: State;
  generateComplaint: (text: string, studentName: string, category?: string, priority?: string) => Promise<Complaint | null>;
  setActiveComplaint: (complaint: Complaint | null) => void;
  updateStatus: (id: string, status: 'Pending' | 'Submitted') => void;
  deleteComplaint: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
  updateProfile: (profile: StudentProfile) => void;
  logout: () => void;
}

const ComplaintContext = createContext<ComplaintContextProps | undefined>(undefined);

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(complaintReducer, initialState);

  const generateComplaint = async (text: string, studentName: string, category?: string, priority?: string): Promise<Complaint | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await convertHinglishToFormal(text, studentName, category, priority);
      const newComplaint: Complaint = {
        id: response.id,
        studentName: response.studentName,
        originalText: response.originalText,
        department: response.department,
        priority: response.priority,
        subject: response.subject,
        location: response.location,
        formalBody: response.formalBody,
        urgencyReason: response.urgencyReason,
        dateSubmitted: response.dateSubmitted,
        status: response.status,
      };
      dispatch({ type: 'ADD_COMPLAINT', payload: newComplaint });
      return newComplaint;
    } catch (err: any) {
      console.error(err);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to process complaint text.' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setActiveComplaint = (complaint: Complaint | null) => {
    dispatch({ type: 'SET_ACTIVE_COMPLAINT', payload: complaint });
  };

  const updateStatus = (id: string, status: 'Pending' | 'Submitted') => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  };

  const deleteComplaint = (id: string) => {
    dispatch({ type: 'DELETE_COMPLAINT', payload: id });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (err: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: err });
  };

  const updateProfile = (profile: StudentProfile) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <ComplaintContext.Provider
      value={{
        state,
        generateComplaint,
        setActiveComplaint,
        updateStatus,
        deleteComplaint,
        setLoading,
        setError,
        updateProfile,
        logout,
      }}
    >
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
