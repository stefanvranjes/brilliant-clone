import React from 'react';
import { Trophy, Flame, Clock, Star } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface UserStats {
  userId: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number;
  achievements: Achievement[];
  level: number;
}

interface ProgressDashboardProps {
  stats: UserStats;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ stats }) => {
  const progressToNextLevel = ((stats.totalXP % 1000) / 1000) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Trophy className="w-6 h-6 text-yellow-500" />}
          label="Level"
          value={stats.level}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          label="Current Streak"
          value={`${stats.currentStreak} days`}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<Star className="w-6 h-6 text-purple-500" />}
          label="Total XP"
          value={stats.totalXP.toLocaleString()}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-500" />}
          label="Problems Solved"
          value={stats.problemsSolved}
          bgColor="bg-blue-50"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Level Progress</h2>
          <span className="text-sm text-gray-600">
            Level {stats.level} → {stats.level + 1}
          </span>
        </div>
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {stats.totalXP % 1000} / 1000 XP to next level
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.achievements.slice(0, 6).map((achievement) => (
            <div
              key={achievement.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
}> = ({ icon, label, value, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-6 border-2 border-gray-100`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-white p-3 rounded-lg">{icon}</div>
    </div>
  </div>
);