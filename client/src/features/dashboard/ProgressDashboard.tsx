import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ActivityChart } from './ActivityChart';
import { PageTransition } from '../../components/ui/PageTransition';

const StatCard = ({ label, value, icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4 text-2xl`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</div>
  </motion.div>
);

const ProgressDashboard = () => {
  const { progress, loading, error } = useProgress();

  if (loading) return <LoadingSpinner />;
  if (error || !progress) return <div className="p-8 text-center text-red-500">Error loading progress</div>;

  return (
    <PageTransition className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600 text-lg">Keep up the momentum!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Total XP" 
          value={progress.totalXP} 
          icon="⚡" 
          color="bg-yellow-100 text-yellow-600" 
          delay={0.1}
        />
        <StatCard 
          label="Current Level" 
          value={progress.level} 
          icon="🏆" 
          color="bg-purple-100 text-purple-600" 
          delay={0.2}
        />
        <StatCard 
          label="Day Streak" 
          value={progress.currentStreak} 
          icon="🔥" 
          color="bg-orange-100 text-orange-600" 
          delay={0.3}
        />
        <StatCard 
          label="Problems Solved" 
          value={progress.problemsSolved} 
          icon="🧩" 
          color="bg-blue-100 text-blue-600" 
          delay={0.4}
        />
      </div>

      {/* Weekly Activity Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
      >
        <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-bold text-gray-900">Weekly Activity</h3>
            <span className="text-sm text-gray-500 font-medium">Last 7 Days</span>
        </div>
        <ActivityChart />
      </motion.div>
    </PageTransition>
  );
};

export default ProgressDashboard;
