import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Faculty {
  id: string;
  name: string;
  cabin: string;
  department: string;
  contributedBy: string;
}

export interface Contribution {
  id: string;
  studentId: string;
  studentName: string;
  facultyName: string;
  cabin: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  isNew?: boolean;
}

interface AppContextType {
  faculty: Faculty[];
  contributions: Contribution[];
  isAdmin: boolean;
  setFaculty: React.Dispatch<React.SetStateAction<Faculty[]>>;
  addContribution: (contribution: Omit<Contribution, 'id' | 'status' | 'submittedAt' | 'isNew'>) => void;
  approveContribution: (id: string) => void;
  rejectContribution: (id: string) => void;
  editContribution: (id: string, data: Partial<Contribution>) => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  uploadFacultyData: (data: Omit<Faculty, 'id' | 'contributedBy'>[]) => void;
  markContributionViewed: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial faculty data
const initialFaculty: Faculty[] = [
  { id: '1', name: 'Dr. Ramesh Kumar', cabin: 'C-101', department: 'Computer Science', contributedBy: 'KLEF' },
  { id: '2', name: 'Dr. Priya Sharma', cabin: 'C-102', department: 'Computer Science', contributedBy: 'KLEF' },
  { id: '3', name: 'Dr. Suresh Reddy', cabin: 'E-201', department: 'Electronics', contributedBy: 'KLEF' },
  { id: '4', name: 'Dr. Lakshmi Devi', cabin: 'E-202', department: 'Electronics', contributedBy: 'KLEF' },
  { id: '5', name: 'Dr. Venkat Rao', cabin: 'M-301', department: 'Mechanical', contributedBy: 'KLEF' },
  { id: '6', name: 'Dr. Anjali Gupta', cabin: 'M-302', department: 'Mechanical', contributedBy: 'KLEF' },
  { id: '7', name: 'Dr. Krishna Murthy', cabin: 'CV-101', department: 'Civil Engineering', contributedBy: 'KLEF' },
  { id: '8', name: 'Dr. Srinivas Rao', cabin: 'CV-102', department: 'Civil Engineering', contributedBy: 'KLEF' },
  { id: '9', name: 'Dr. Padma Priya', cabin: 'IT-201', department: 'Information Technology', contributedBy: 'KLEF' },
  { id: '10', name: 'Dr. Ravi Teja', cabin: 'IT-202', department: 'Information Technology', contributedBy: 'KLEF' },
  { id: '11', name: 'Dr. Swathi Reddy', cabin: 'MBA-101', department: 'Business Administration', contributedBy: 'KLEF' },
  { id: '12', name: 'Dr. Harish Chandra', cabin: 'MBA-102', department: 'Business Administration', contributedBy: 'KLEF' },
];

const ADMIN_USERNAME = '2200030907';
const ADMIN_PASSWORD = 'Vamshi@130';

export function AppProvider({ children }: { children: ReactNode }) {
  const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addContribution = useCallback((contribution: Omit<Contribution, 'id' | 'status' | 'submittedAt' | 'isNew'>) => {
    const newContribution: Contribution = {
      ...contribution,
      id: `contrib-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date(),
      isNew: true,
    };
    setContributions(prev => [newContribution, ...prev]);
  }, []);

  const approveContribution = useCallback((id: string) => {
    setContributions(prev => {
      const contribution = prev.find(c => c.id === id);
      if (!contribution) return prev;

      // Update faculty list
      setFaculty(prevFaculty => {
        const existingIndex = prevFaculty.findIndex(
          f => f.name.toLowerCase() === contribution.facultyName.toLowerCase()
        );

        if (existingIndex >= 0) {
          // Update existing faculty
          const updated = [...prevFaculty];
          updated[existingIndex] = {
            ...updated[existingIndex],
            cabin: contribution.cabin,
            department: contribution.department,
            contributedBy: contribution.studentName,
          };
          return updated;
        } else {
          // Add new faculty
          return [
            ...prevFaculty,
            {
              id: `faculty-${Date.now()}`,
              name: contribution.facultyName,
              cabin: contribution.cabin,
              department: contribution.department,
              contributedBy: contribution.studentName,
            },
          ];
        }
      });

      return prev.map(c => (c.id === id ? { ...c, status: 'approved', isNew: false } : c));
    });
  }, []);

  const rejectContribution = useCallback((id: string) => {
    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'rejected', isNew: false } : c))
    );
  }, []);

  const editContribution = useCallback((id: string, data: Partial<Contribution>) => {
    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data } : c))
    );
  }, []);

  const loginAdmin = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const uploadFacultyData = useCallback((data: Omit<Faculty, 'id' | 'contributedBy'>[]) => {
    const newFaculty: Faculty[] = data.map((item, index) => ({
      ...item,
      id: `uploaded-${Date.now()}-${index}`,
      contributedBy: 'KLEF',
    }));
    setFaculty(prev => [...prev, ...newFaculty]);
  }, []);

  const markContributionViewed = useCallback((id: string) => {
    setContributions(prev =>
      prev.map(c => (c.id === id ? { ...c, isNew: false } : c))
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        faculty,
        contributions,
        isAdmin,
        setFaculty,
        addContribution,
        approveContribution,
        rejectContribution,
        editContribution,
        loginAdmin,
        logoutAdmin,
        uploadFacultyData,
        markContributionViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
