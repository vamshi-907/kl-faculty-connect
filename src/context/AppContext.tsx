import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  loading: boolean;
  addContribution: (contribution: Omit<Contribution, 'id' | 'status' | 'submittedAt' | 'isNew'>) => Promise<void>;
  approveContribution: (id: string) => Promise<void>;
  rejectContribution: (id: string) => Promise<void>;
  editContribution: (id: string, data: Partial<Contribution>) => Promise<void>;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  uploadFacultyData: (data: Omit<Faculty, 'id' | 'contributedBy'>[]) => Promise<void>;
  markContributionViewed: (id: string) => Promise<void>;
  refreshFaculty: () => Promise<void>;
  refreshContributions: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_USERNAME = '2200030907';
const ADMIN_PASSWORD = 'Vamshi@130';

export function AppProvider({ children }: { children: ReactNode }) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFaculty = useCallback(async () => {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('name');
    if (!error && data) {
      setFaculty(data.map(f => ({
        id: f.id,
        name: f.name,
        cabin: f.cabin,
        department: f.department,
        contributedBy: f.contributed_by,
      })));
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (!error && data) {
      setContributions(data.map(c => ({
        id: c.id,
        studentId: c.student_id,
        studentName: c.student_name,
        facultyName: c.faculty_name,
        cabin: c.cabin,
        department: c.department,
        status: c.status as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date(c.submitted_at),
        isNew: c.is_new,
      })));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFaculty(), fetchContributions()]);
      setLoading(false);
    };
    init();
  }, [fetchFaculty, fetchContributions]);

  const addContribution = useCallback(async (contribution: Omit<Contribution, 'id' | 'status' | 'submittedAt' | 'isNew'>) => {
    await supabase.from('contributions').insert({
      student_id: contribution.studentId,
      student_name: contribution.studentName,
      faculty_name: contribution.facultyName,
      cabin: contribution.cabin,
      department: contribution.department,
    });
    await fetchContributions();
  }, [fetchContributions]);

  const approveContribution = useCallback(async (id: string) => {
    const contribution = contributions.find(c => c.id === id);
    if (!contribution) return;

    // Update contribution status
    await supabase.from('contributions').update({ status: 'approved', is_new: false }).eq('id', id);

    // Update or insert faculty
    const { data: existing } = await supabase
      .from('faculty')
      .select('id')
      .ilike('name', contribution.facultyName)
      .maybeSingle();

    if (existing) {
      await supabase.from('faculty').update({
        cabin: contribution.cabin,
        department: contribution.department,
        contributed_by: contribution.studentName,
      }).eq('id', existing.id);
    } else {
      await supabase.from('faculty').insert({
        name: contribution.facultyName,
        cabin: contribution.cabin,
        department: contribution.department,
        contributed_by: contribution.studentName,
      });
    }

    await Promise.all([fetchFaculty(), fetchContributions()]);
  }, [contributions, fetchFaculty, fetchContributions]);

  const rejectContribution = useCallback(async (id: string) => {
    await supabase.from('contributions').update({ status: 'rejected', is_new: false }).eq('id', id);
    await fetchContributions();
  }, [fetchContributions]);

  const editContribution = useCallback(async (id: string, data: Partial<Contribution>) => {
    const updateData: Record<string, unknown> = {};
    if (data.facultyName !== undefined) updateData.faculty_name = data.facultyName;
    if (data.cabin !== undefined) updateData.cabin = data.cabin;
    if (data.department !== undefined) updateData.department = data.department;
    
    await supabase.from('contributions').update(updateData).eq('id', id);
    await fetchContributions();
  }, [fetchContributions]);

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

  const uploadFacultyData = useCallback(async (data: Omit<Faculty, 'id' | 'contributedBy'>[]) => {
    const rows = data.map(item => ({
      name: item.name,
      cabin: item.cabin,
      department: item.department,
      contributed_by: 'KLEF',
    }));
    await supabase.from('faculty').insert(rows);
    await fetchFaculty();
  }, [fetchFaculty]);

  const markContributionViewed = useCallback(async (id: string) => {
    await supabase.from('contributions').update({ is_new: false }).eq('id', id);
    await fetchContributions();
  }, [fetchContributions]);

  return (
    <AppContext.Provider
      value={{
        faculty,
        contributions,
        isAdmin,
        loading,
        addContribution,
        approveContribution,
        rejectContribution,
        editContribution,
        loginAdmin,
        logoutAdmin,
        uploadFacultyData,
        markContributionViewed,
        refreshFaculty: fetchFaculty,
        refreshContributions: fetchContributions,
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
