import React from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ActivityChart } from './ActivityChart';
import { PageTransition } from '../../components/ui/PageTransition';
import { AchievementCard } from '../../components/ui/AchievementCard';
import { apiService } from '../../services/api.service';
import { Achievement } from '../../mockData';
import { aiService, AiSummary } from '../../services/ai.service';

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
  const [aiSummary, setAiSummary] = React.useState<AiSummary | null>(null);
  const [loadingAi, setLoadingAi] = React.useState(true);

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

    const fetchAiSummary = async () => {
      try {
        const data = await aiService.getSummary();
        setAiSummary(data);
      } catch (err) {
        console.error('Failed to fetch AI summary', err);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchAchievements();
    fetchAiSummary();
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-bold text-gray-900">Weekly Activity</h3>
            <span className="text-sm text-gray-500 font-medium">Last 7 Days</span>
          </div>
          <ActivityChart />
        </motion.div>

        {/* AI Coach Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🤖</div>
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="text-yellow-400">✨</span> AI Coach
            </h3>

            {loadingAi ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ) : aiSummary ? (
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-2">Strengths</div>
                  <div className="flex flex-wrap gap-2">
                    {aiSummary.strengths.map(s => (
                      <span key={s} className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Focus Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {aiSummary.weaknesses.map(w => (
                      <span key={w} className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">{w}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-medium leading-relaxed opacity-80 italic">
                    "{aiSummary.overallAdvice}"
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Failed to load AI insights.</p>
            )}
          </div>
        </motion.div>
      </div>

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
