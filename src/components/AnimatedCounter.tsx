import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  duration?: number;
}

export function AnimatedCounter({ value, label, icon, duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
    >
      <div className="p-3 bg-accent rounded-xl text-primary mb-4">
        {icon}
      </div>
      <span className="text-4xl font-bold text-primary tabular-nums">
        {count.toLocaleString()}+
      </span>
      <span className="text-muted-foreground mt-1 text-sm font-medium">{label}</span>
    </motion.div>
  );
}
