import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, ArrowRight, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CGPACalculator() {
  const [cgpa, setCgpa] = useState('');
  const [percentage, setPercentage] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePercentage = () => {
    const cgpaValue = parseFloat(cgpa);
    
    if (isNaN(cgpaValue)) {
      setError('Please enter a valid CGPA');
      setPercentage(null);
      return;
    }
    
    if (cgpaValue < 0 || cgpaValue > 10) {
      setError('CGPA must be between 0 and 10');
      setPercentage(null);
      return;
    }

    setError('');
    setIsCalculating(true);
    
    // Simulate calculation animation
    setTimeout(() => {
      const result = (cgpaValue - 0.5) * 10;
      setPercentage(Math.max(0, Math.min(100, result)));
      setIsCalculating(false);
    }, 300);
  };

  const reset = () => {
    setCgpa('');
    setPercentage(null);
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
          <h1 className="text-4xl font-bold text-primary mb-3">CGPA to Percentage</h1>
          <p className="text-muted-foreground">
            Convert your Cumulative Grade Point Average to percentage
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-border shadow-lg">
            <CardHeader className="text-center border-b border-border">
              <CardTitle className="text-xl">Enter Your CGPA</CardTitle>
              <CardDescription>Use the standard 10-point scale</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    CGPA (0 - 10)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="Enter CGPA (e.g., 8.5)"
                    value={cgpa}
                    onChange={(e) => {
                      setCgpa(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && calculatePercentage()}
                    className={`h-14 text-lg text-center input-academic ${error ? 'border-destructive' : ''}`}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={calculatePercentage}
                    disabled={!cgpa || isCalculating}
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
                        Calculate
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
                {percentage !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="bg-accent rounded-xl p-6 text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Your Percentage</p>
                    <p className="text-5xl font-bold text-primary">
                      {percentage.toFixed(2)}%
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
                        <span className="font-mono bg-background px-2 py-1 rounded">
                          Percentage = (CGPA - 0.5) × 10
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs mt-2">
                        This is the standard formula used by most Indian universities including KL University.
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
