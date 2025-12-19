import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProgressDashboard from './features/dashboard/ProgressDashboard';
import InteractiveProblem from './features/problem-solving/InteractiveProblem';
import { useProblems } from './hooks/useProblem';
import { PageTransition } from './components/ui/PageTransition';

// Simple Landing/Home Component to list problems
const Home = () => {
  const { problems, loading } = useProblems();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(problems.map(p => p.category)));
    return ['All', ...uniqueCats.sort()];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    if (selectedCategory === 'All') return problems;
    return problems.filter(p => p.category === selectedCategory);
  }, [problems, selectedCategory]);

  if (loading) return <div className="p-8 text-center">Loading Content...</div>;

  return (
    <PageTransition className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Path</h1>
        <Link to="/dashboard" className="text-blue-600 font-semibold hover:underline">
          View Dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-black text-white border-black shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((prob) => (
            <Link 
              key={prob.id} 
              to={`/problem/${prob.id}`}
              className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      prob.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      prob.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prob.difficulty}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {prob.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{prob.title}</h3>
                  <p className="mt-1 text-gray-600">{prob.description.substring(0, 100)}...</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-blue-600">+{prob.xpReward} XP</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No problems found in this category.</p>
            <button 
              onClick={() => setSelectedCategory('All')}
              className="mt-2 text-blue-600 hover:underline font-semibold"
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
