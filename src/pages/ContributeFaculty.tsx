import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/context/AppContext';

interface FormData {
  studentId: string;
  studentName: string;
  facultyName: string;
  cabin: string;
  department: string;
}

const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil Engineering',
  'Information Technology',
  'Business Administration',
  'Electrical Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Other',
];

export default function ContributeFaculty() {
  const { addContribution } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    studentName: '',
    facultyName: '',
    cabin: '',
    department: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^\d{10}$/.test(formData.studentId.trim())) {
      newErrors.studentId = 'Student ID must be 10 digits';
    }

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters';
    }

    if (!formData.facultyName.trim()) {
      newErrors.facultyName = 'Faculty name is required';
    } else if (formData.facultyName.trim().length < 2) {
      newErrors.facultyName = 'Faculty name must be at least 2 characters';
    }

    if (!formData.cabin.trim()) {
      newErrors.cabin = 'Cabin number is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      addContribution({
        studentId: formData.studentId.trim(),
        studentName: formData.studentName.trim(),
        facultyName: formData.facultyName.trim(),
        cabin: formData.cabin.trim().toUpperCase(),
        department: formData.department,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: 'Contribution Submitted!',
        description: 'Your contribution is pending admin approval. Thank you for helping!',
      });

      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          studentId: '',
          studentName: '',
          facultyName: '',
          cabin: '',
          department: '',
        });
        setIsSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl text-primary mb-4">
            <UserPlus className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-3">Contribute Faculty Cabin</h1>
          <p className="text-muted-foreground">
            Help keep our directory updated by submitting faculty cabin information
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-border shadow-lg">
            <CardHeader className="text-center border-b border-border">
              <CardTitle className="text-xl">Contribution Form</CardTitle>
              <CardDescription>All fields are required. Your submission will be reviewed by admin.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full text-green-600 mb-4"
                  >
                    <CheckCircle className="h-10 w-10" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">Your contribution has been submitted successfully.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Student ID */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Student ID <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., 2200030001"
                      value={formData.studentId}
                      onChange={(e) => handleChange('studentId', e.target.value)}
                      className={`h-12 input-academic ${errors.studentId ? 'border-destructive' : ''}`}
                    />
                    {errors.studentId && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.studentId}
                      </motion.p>
                    )}
                  </div>

                  {/* Student Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.studentName}
                      onChange={(e) => handleChange('studentName', e.target.value)}
                      className={`h-12 input-academic ${errors.studentName ? 'border-destructive' : ''}`}
                    />
                    {errors.studentName && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.studentName}
                      </motion.p>
                    )}
                  </div>

                  {/* Faculty Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Faculty Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Dr. Ramesh Kumar"
                      value={formData.facultyName}
                      onChange={(e) => handleChange('facultyName', e.target.value)}
                      className={`h-12 input-academic ${errors.facultyName ? 'border-destructive' : ''}`}
                    />
                    {errors.facultyName && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.facultyName}
                      </motion.p>
                    )}
                  </div>

                  {/* Cabin Number */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cabin Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., C-101"
                      value={formData.cabin}
                      onChange={(e) => handleChange('cabin', e.target.value)}
                      className={`h-12 input-academic ${errors.cabin ? 'border-destructive' : ''}`}
                    />
                    {errors.cabin && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.cabin}
                      </motion.p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className={`w-full h-12 px-4 rounded-lg border bg-background text-foreground input-academic ${
                        errors.department ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-destructive text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.department}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 btn-primary text-base mt-6"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Contribution
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
