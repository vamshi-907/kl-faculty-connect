import { motion } from 'framer-motion';
import { User, MapPin, Building, UserCheck } from 'lucide-react';

interface FacultyCardProps {
  name: string;
  cabin: string;
  department: string;
  contributedBy: string;
  searchTerm?: string;
  index?: number;
}

function highlightMatch(text: string, searchTerm: string) {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function FacultyCard({ name, cabin, department, contributedBy, searchTerm = '', index = 0 }: FacultyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-card rounded-xl border-2 border-border hover:border-primary/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-accent rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <User className="h-6 w-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">
            {highlightMatch(name, searchTerm)}
          </h3>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">
                Cabin: <span className="font-medium text-foreground">{highlightMatch(cabin, searchTerm)}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm truncate">
                {highlightMatch(department, searchTerm)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm">
                Contributed by: {' '}
                <span className={`font-medium ${contributedBy !== 'KLEF' ? 'text-primary' : 'text-foreground'}`}>
                  {contributedBy}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
