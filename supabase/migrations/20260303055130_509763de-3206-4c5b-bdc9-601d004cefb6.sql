
-- Create faculty table
CREATE TABLE public.faculty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cabin TEXT NOT NULL,
  department TEXT NOT NULL,
  contributed_by TEXT NOT NULL DEFAULT 'KLEF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contributions table
CREATE TABLE public.contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  cabin TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_new BOOLEAN NOT NULL DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Faculty: everyone can read
CREATE POLICY "Anyone can view faculty" ON public.faculty FOR SELECT USING (true);

-- Faculty: only service role / authenticated can insert/update/delete (admin via app logic)
CREATE POLICY "Authenticated users can insert faculty" ON public.faculty FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update faculty" ON public.faculty FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete faculty" ON public.faculty FOR DELETE TO authenticated USING (true);

-- Allow anon to insert faculty (for admin uploads without auth)
CREATE POLICY "Anon can insert faculty" ON public.faculty FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon can update faculty" ON public.faculty FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon can delete faculty" ON public.faculty FOR DELETE TO anon USING (true);

-- Contributions: everyone can read and insert
CREATE POLICY "Anyone can view contributions" ON public.contributions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contributions" ON public.contributions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contributions" ON public.contributions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contributions" ON public.contributions FOR DELETE USING (true);

-- Insert initial faculty data
INSERT INTO public.faculty (name, cabin, department, contributed_by) VALUES
  ('Dr. Ramesh Kumar', 'C-101', 'Computer Science', 'KLEF'),
  ('Dr. Priya Sharma', 'C-102', 'Computer Science', 'KLEF'),
  ('Dr. Suresh Reddy', 'E-201', 'Electronics', 'KLEF'),
  ('Dr. Lakshmi Devi', 'E-202', 'Electronics', 'KLEF'),
  ('Dr. Venkat Rao', 'M-301', 'Mechanical', 'KLEF'),
  ('Dr. Anjali Gupta', 'M-302', 'Mechanical', 'KLEF'),
  ('Dr. Krishna Murthy', 'CV-101', 'Civil Engineering', 'KLEF'),
  ('Dr. Srinivas Rao', 'CV-102', 'Civil Engineering', 'KLEF'),
  ('Dr. Padma Priya', 'IT-201', 'Information Technology', 'KLEF'),
  ('Dr. Ravi Teja', 'IT-202', 'Information Technology', 'KLEF'),
  ('Dr. Swathi Reddy', 'MBA-101', 'Business Administration', 'KLEF'),
  ('Dr. Harish Chandra', 'MBA-102', 'Business Administration', 'KLEF');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
