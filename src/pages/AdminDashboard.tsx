import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Upload,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  FileSpreadsheet,
  Eye,
  Trash2,
  Save,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApp, Contribution } from '@/context/AppContext';

interface ExcelFaculty {
  name: string;
  cabin: string;
  department: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAdmin,
    faculty,
    contributions,
    approveContribution,
    rejectContribution,
    editContribution,
    uploadFacultyData,
    markContributionViewed,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'contributions' | 'upload'>('contributions');
  const [excelData, setExcelData] = useState<ExcelFaculty[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contribution>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/admin-login');
    return null;
  }

  const pendingContributions = contributions.filter(c => c.status === 'pending');
  const newContributions = contributions.filter(c => c.isNew);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, string>[];

        // Map Excel columns to our format
        const mappedData: ExcelFaculty[] = jsonData.map(row => ({
          name: row['Faculty Name'] || row['Name'] || row['name'] || '',
          cabin: row['Cabin Number'] || row['Cabin'] || row['cabin'] || '',
          department: row['Department'] || row['department'] || '',
        })).filter(item => item.name && item.cabin);

        setExcelData(mappedData);
        setShowPreview(true);

        toast({
          title: 'File Loaded',
          description: `Found ${mappedData.length} faculty records. Please review before saving.`,
        });
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to read Excel file. Please check the format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveExcelData = () => {
    uploadFacultyData(excelData);
    setExcelData([]);
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    toast({
      title: 'Success!',
      description: `${excelData.length} faculty records have been added.`,
    });
  };

  const handleApprove = (id: string) => {
    approveContribution(id);
    toast({
      title: 'Approved!',
      description: 'The contribution has been approved and the faculty list is updated.',
    });
  };

  const handleReject = (id: string) => {
    rejectContribution(id);
    toast({
      title: 'Rejected',
      description: 'The contribution has been rejected.',
    });
  };

  const startEdit = (contribution: Contribution) => {
    setEditingId(contribution.id);
    setEditForm({
      facultyName: contribution.facultyName,
      cabin: contribution.cabin,
      department: contribution.department,
    });
    markContributionViewed(contribution.id);
  };

  const saveEdit = () => {
    if (editingId) {
      editContribution(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      toast({
        title: 'Updated!',
        description: 'Contribution details have been updated.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage faculty data and student contributions
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent rounded-xl text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{faculty.length}</p>
                  <p className="text-sm text-muted-foreground">Total Faculty</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-xl text-yellow-700">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingContributions.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl text-green-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contributions.filter(c => c.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-xl text-red-700">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {contributions.filter(c => c.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          <Button
            variant={activeTab === 'contributions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('contributions')}
            className={activeTab === 'contributions' ? 'btn-primary' : ''}
          >
            <Users className="h-4 w-4 mr-2" />
            Contributions
            {newContributions.length > 0 && (
              <Badge className="ml-2 bg-primary-foreground text-primary">
                {newContributions.length} NEW
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className={activeTab === 'upload' ? 'btn-primary' : ''}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Faculty
          </Button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'contributions' ? (
            <motion.div
              key="contributions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Student Contributions</CardTitle>
                  <CardDescription>Review and manage faculty cabin contributions from students</CardDescription>
                </CardHeader>
                <CardContent>
                  {contributions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Contributions Yet</h3>
                      <p className="text-muted-foreground">Student contributions will appear here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Faculty</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cabin</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {contributions.map((contribution) => (
                              <motion.tr
                                key={contribution.id}
                                initial={{ opacity: 0, backgroundColor: contribution.isNew ? 'hsl(var(--accent))' : 'transparent' }}
                                animate={{ opacity: 1, backgroundColor: 'transparent' }}
                                exit={{ opacity: 0 }}
                                className="border-b hover:bg-muted/50 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {contribution.isNew && (
                                      <Badge className="bg-primary text-primary-foreground text-xs">NEW</Badge>
                                    )}
                                    <div>
                                      <p className="font-medium">{contribution.studentName}</p>
                                      <p className="text-xs text-muted-foreground">{contribution.studentId}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {editingId === contribution.id ? (
                                    <Input
                                      value={editForm.facultyName || ''}
                                      onChange={(e) => setEditForm({ ...editForm, facultyName: e.target.value })}
                                      className="h-8"
                                    />
                                  ) : (
                                    contribution.facultyName
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {editingId === contribution.id ? (
                                    <Input
                                      value={editForm.cabin || ''}
                                      onChange={(e) => setEditForm({ ...editForm, cabin: e.target.value })}
                                      className="h-8 w-24"
                                    />
                                  ) : (
                                    contribution.cabin
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  {editingId === contribution.id ? (
                                    <Input
                                      value={editForm.department || ''}
                                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                      className="h-8"
                                    />
                                  ) : (
                                    contribution.department
                                  )}
                                </td>
                                <td className="py-3 px-4">{getStatusBadge(contribution.status)}</td>
                                <td className="py-3 px-4">
                                  {editingId === contribution.id ? (
                                    <div className="flex gap-1">
                                      <Button size="sm" onClick={saveEdit} className="h-8">
                                        <Save className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingId(null)}
                                        className="h-8"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : contribution.status === 'pending' ? (
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprove(contribution.id)}
                                        className="h-8 bg-green-600 hover:bg-green-700"
                                      >
                                        <CheckCircle className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject(contribution.id)}
                                        className="h-8"
                                      >
                                        <XCircle className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEdit(contribution)}
                                        className="h-8"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">—</span>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upload Faculty Data</CardTitle>
                  <CardDescription>
                    Upload an Excel file with faculty information. Required columns: Faculty Name, Cabin Number, Department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Upload Area */}
                    <div
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium text-foreground mb-1">Click to upload Excel file</p>
                      <p className="text-sm text-muted-foreground">Supports .xlsx, .xls, and .csv files</p>
                    </div>

                    {/* Preview */}
                    {showPreview && excelData.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            <span className="font-medium">Preview ({excelData.length} records)</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setExcelData([]);
                                setShowPreview(false);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleSaveExcelData} className="btn-primary">
                              <Save className="h-4 w-4 mr-2" />
                              Save All
                            </Button>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-muted sticky top-0">
                              <tr>
                                <th className="text-left py-3 px-4 font-medium">#</th>
                                <th className="text-left py-3 px-4 font-medium">Faculty Name</th>
                                <th className="text-left py-3 px-4 font-medium">Cabin</th>
                                <th className="text-left py-3 px-4 font-medium">Department</th>
                              </tr>
                            </thead>
                            <tbody>
                              {excelData.map((item, index) => (
                                <tr key={index} className="border-t">
                                  <td className="py-2 px-4 text-muted-foreground">{index + 1}</td>
                                  <td className="py-2 px-4">{item.name}</td>
                                  <td className="py-2 px-4">{item.cabin}</td>
                                  <td className="py-2 px-4">{item.department}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}

                    {/* Instructions */}
                    <div className="bg-muted/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground mb-1">Excel Format Requirements</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Column headers should be: "Faculty Name", "Cabin Number", "Department"</li>
                            <li>• Alternative headers: "Name", "Cabin", "department" (case-insensitive)</li>
                            <li>• Make sure there are no empty rows</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
