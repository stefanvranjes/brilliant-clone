import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ActivityChart } from './ActivityChart';
import { PageTransition } from '../../components/ui/PageTransition';
import { AchievementCard } from '../../components/ui/AchievementCard';
import { apiService } from '../../services/api.service';
import { Achievement } from '../../mockData';

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
  const { progress, loading: progressLoading, error: progressError } = useProgress();
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = React.useState(true);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await apiService.getAllAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Failed to fetch achievements', err);
      } finally {
        setLoadingAchievements(false);
      }
    };
    fetchAchievements();
  }, []);

  if (progressLoading || loadingAchievements) return <LoadingSpinner />;
  if (progressError || !progress) return <div className="p-8 text-center text-red-500">Error loading progress</div>;

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

      {/* Achievements Section */}
      <div className="mt-16 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Achievements</h2>
            <p className="text-gray-600 font-medium">Badges you've earned on your journey.</p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl text-yellow-700 font-black text-sm border border-yellow-100 flex items-center gap-2">
            <span>🏆</span>
            <span>{progress.unlockedAchievementIds?.length || 0} / {achievements.length} Unlocked</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={progress.unlockedAchievementIds?.includes(achievement.id)}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProgressDashboard;
