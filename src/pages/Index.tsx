import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Users, Building2, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { useApp } from '@/context/AppContext';

export default function Index() {
  const { faculty, contributions } = useApp();
  
  const departments = [...new Set(faculty.map(f => f.department))];
  const studentContributions = contributions.filter(c => c.status === 'approved').length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/30 py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Award className="h-4 w-4" />
              KL University Official Portal
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Faculty Cabins Portal
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Quickly find faculty cabin details and help keep information accurate. 
              Your one-stop solution for locating faculty across the campus.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="btn-primary text-base px-8 h-12 group">
                <Link to="/faculty">
                  <Search className="h-5 w-5 mr-2" />
                  Search Faculty
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12 border-primary/30 hover:bg-accent">
                <Link to="/contribute">
                  <Plus className="h-5 w-5 mr-2" />
                  Contribute Cabin Info
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">Portal Statistics</h2>
            <p className="text-muted-foreground">Real-time data from our growing community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCounter
              value={faculty.length}
              label="Total Faculty"
              icon={<Users className="h-6 w-6" />}
            />
            <AnimatedCounter
              value={departments.length}
              label="Departments"
              icon={<Building2 className="h-6 w-6" />}
            />
            <AnimatedCounter
              value={studentContributions}
              label="Student Contributions"
              icon={<Award className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">What You Can Do</h2>
            <p className="text-muted-foreground">Explore all the features of our portal</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Search Faculty',
                description: 'Find any faculty member instantly with our real-time search.',
                link: '/faculty',
                icon: Search,
              },
              {
                title: 'CGPA Calculator',
                description: 'Convert your CGPA to percentage with ease.',
                link: '/cgpa-calculator',
                icon: Award,
              },
              {
                title: 'SGPA Calculator',
                description: 'Calculate your cumulative CGPA from SGPAs.',
                link: '/sgpa-calculator',
                icon: Building2,
              },
              {
                title: 'Contribute',
                description: 'Help update faculty cabin information.',
                link: '/contribute',
                icon: Plus,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="block p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full group"
                >
                  <div className="p-3 bg-accent rounded-xl text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-foreground/80">
            © {new Date().getFullYear()} KL University Faculty Cabins Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
