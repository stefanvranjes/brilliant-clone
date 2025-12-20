import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProgressDashboard from './features/dashboard/ProgressDashboard';
import InteractiveProblem from './features/problem-solving/InteractiveProblem';
import ModuleDetail from './features/modules/ModuleDetail';
import { useModules } from './hooks/useModules';
import { ModuleCard } from './components/ui/ModuleCard';
import { PageTransition } from './components/ui/PageTransition';
import { DailyChallengeCard } from './components/ui/DailyChallengeCard';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import { useProgress } from './hooks/useProgress';

// Simple Landing/Home Component to list modules
const Home = () => {
  const { modules, loading: modulesLoading, error: modulesError } = useModules();
  const { challenge, isCompleted, loading: challengeLoading } = useDailyChallenge();
  const { progress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(modules.map((m: any) => m.category)));
    return ['All', ...uniqueCats.sort()];
  }, [modules]);

  const filteredModules = useMemo(() => {
    if (selectedCategory === 'All') return modules;
    return modules.filter((m: any) => m.category === selectedCategory);
  }, [modules, selectedCategory]);

  if (modulesLoading || challengeLoading) return <div className="p-8 text-center text-gray-500 font-medium">Loading...</div>;
  if (modulesError) return <div className="p-8 text-center text-red-500 font-medium">{modulesError}</div>;

  return (
    <PageTransition className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Level up your mind</h1>
          <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
            Master complex concepts through interactive, bite-sized lessons in math, logic, and computer science.
          </p>
        </div>
        <Link to="/dashboard" className="text-sm font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors">
          View My Progress
        </Link>
      </div>

      <DailyChallengeCard
        challenge={challenge}
        isCompleted={isCompleted}
        streak={progress?.currentStreak || 0}
      />

      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${selectedCategory === cat
              ? 'bg-black text-white border-black shadow-lg shadow-black/10'
              : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-bold text-lg">No courses found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-4 text-blue-600 font-black hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">B</div>
          <span>BrilliantClone</span>
        </Link>
        <div className="flex gap-4">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-black">Explore</Link>
          <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black">My Progress</Link>
        </div>
      </div>
    </nav>
    <main>
      {children}
    </main>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProgressDashboard />} />
        <Route path="/module/:moduleId" element={<ModuleDetail />} />
        <Route path="/problem/:problemId" element={<InteractiveProblem />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
