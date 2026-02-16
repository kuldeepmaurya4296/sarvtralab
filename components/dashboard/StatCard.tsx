'use client';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'success' | 'accent';
}

const colorClasses = {
  primary: 'from-primary/10 to-primary/5 border-primary/20',
  secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
  success: 'from-success/10 to-success/5 border-success/20',
  accent: 'from-accent/10 to-accent/5 border-accent/20'
};

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  accent: 'bg-accent/10 text-accent'
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  color = 'primary'
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border bg-gradient-to-br ${colorClasses[color]} transition-all hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full
            ${changeType === 'positive' ? 'bg-success/10 text-success' :
              changeType === 'negative' ? 'bg-destructive/10 text-destructive' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  );
};

export default StatCard;


