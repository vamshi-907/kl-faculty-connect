import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, Info, ArrowRight, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Semester {
  id: string;
  sgpa: string;
  credits: string;
}

export default function SGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', sgpa: '', credits: '' },
    { id: '2', sgpa: '', credits: '' },
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const addSemester = () => {
    setSemesters([
      ...semesters,
      { id: `${Date.now()}`, sgpa: '', credits: '' },
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: 'sgpa' | 'credits', value: string) => {
    setSemesters(semesters.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
    setError('');
  };

  const calculateCGPA = () => {
    // Validate all inputs
    for (let i = 0; i < semesters.length; i++) {
      const sem = semesters[i];
      const sgpa = parseFloat(sem.sgpa);
      const credits = parseFloat(sem.credits);

      if (isNaN(sgpa) || isNaN(credits)) {
        setError(`Please fill all fields for Semester ${i + 1}`);
        setCgpa(null);
        return;
      }

      if (sgpa < 0 || sgpa > 10) {
        setError(`SGPA for Semester ${i + 1} must be between 0 and 10`);
        setCgpa(null);
        return;
      }

      if (credits <= 0) {
        setError(`Credits for Semester ${i + 1} must be greater than 0`);
        setCgpa(null);
        return;
      }
    }

    setError('');
    setIsCalculating(true);

    setTimeout(() => {
      let totalGradePoints = 0;
      let totalCredits = 0;

      semesters.forEach(sem => {
        const sgpa = parseFloat(sem.sgpa);
        const credits = parseFloat(sem.credits);
        totalGradePoints += sgpa * credits;
        totalCredits += credits;
      });

      const result = totalGradePoints / totalCredits;
      setCgpa(result);
      setIsCalculating(false);
    }, 300);
  };

  const reset = () => {
    setSemesters([
      { id: '1', sgpa: '', credits: '' },
      { id: '2', sgpa: '', credits: '' },
    ]);
    setCgpa(null);
    setError('');
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
            <Calculator className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-3">SGPA to CGPA</h1>
          <p className="text-muted-foreground">
            Calculate your Cumulative GPA from semester-wise SGPAs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-border shadow-lg">
            <CardHeader className="text-center border-b border-border">
              <CardTitle className="text-xl">Enter Semester Details</CardTitle>
              <CardDescription>Add your SGPA and credits for each semester</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Semester Inputs */}
                <AnimatePresence mode="popLayout">
                  {semesters.map((semester, index) => (
                    <motion.div
                      key={semester.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl"
                    >
                      <span className="text-sm font-medium text-muted-foreground w-24 flex-shrink-0">
                        Semester {index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">SGPA</label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="10"
                            placeholder="e.g., 8.5"
                            value={semester.sgpa}
                            onChange={(e) => updateSemester(semester.id, 'sgpa', e.target.value)}
                            className="h-10 input-academic"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Credits</label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 24"
                            value={semester.credits}
                            onChange={(e) => updateSemester(semester.id, 'credits', e.target.value)}
                            className="h-10 input-academic"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSemester(semester.id)}
                        disabled={semesters.length === 1}
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Semester Button */}
                <Button
                  variant="outline"
                  onClick={addSemester}
                  className="w-full h-12 border-dashed border-2 hover:border-primary hover:bg-accent"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Semester
                </Button>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={calculateCGPA}
                    disabled={isCalculating}
                    className="flex-1 h-12 btn-primary text-base"
                  >
                    {isCalculating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Calculator className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <>
                        Calculate CGPA
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="h-12 px-4"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>

                {/* Result */}
                {cgpa !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-accent rounded-xl p-6 text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Your CGPA</p>
                    <p className="text-5xl font-bold text-primary">
                      {cgpa.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Equivalent to {((cgpa - 0.5) * 10).toFixed(2)}%
                    </p>
                  </motion.div>
                )}

                {/* Formula */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">Formula Used</p>
                      <p className="text-muted-foreground text-sm">
                        <span className="font-mono bg-background px-2 py-1 rounded text-xs">
                          CGPA = Σ(SGPA × Credits) / Σ(Credits)
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs mt-2">
                        This is a weighted average calculation based on credit hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
