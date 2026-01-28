import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FacultyCard } from '@/components/FacultyCard';
import { useApp } from '@/context/AppContext';

export default function FacultyList() {
  const { faculty } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const departments = useMemo(() => {
    return [...new Set(faculty.map(f => f.department))].sort();
  }, [faculty]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      const matchesSearch = !searchTerm.trim() || 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cabin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = !selectedDepartment || f.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [faculty, searchTerm, selectedDepartment]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-primary mb-3">Faculty Directory</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search and find faculty cabin information. Results update as you type.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, cabin number, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base input-academic"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-w-[200px]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedDepartment) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 mt-4 pt-4 border-t border-border"
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedDepartment && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedDepartment}
                  <button onClick={() => setSelectedDepartment('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }}
                className="text-muted-foreground hover:text-foreground ml-auto"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-6"
        >
          <Users className="h-5 w-5 text-primary" />
          <span className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredFaculty.length}</span> of {faculty.length} faculty members
          </span>
        </motion.div>

        {/* Faculty Grid */}
        <AnimatePresence mode="popLayout">
          {filteredFaculty.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFaculty.map((member, index) => (
                <FacultyCard
                  key={member.id}
                  name={member.name}
                  cabin={member.cabin}
                  department={member.department}
                  contributedBy={member.contributedBy}
                  searchTerm={searchTerm}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any faculty members matching your search. Try adjusting your filters or search term.
              </p>
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(''); setSelectedDepartment(''); }}
                className="mt-4"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
