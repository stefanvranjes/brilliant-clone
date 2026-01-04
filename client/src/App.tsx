import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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
import Leaderboard from './pages/Leaderboard';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ProblemList from './pages/admin/ProblemList';
import ProblemEditor from './pages/admin/ProblemEditor';
import CourseManager from './pages/admin/CourseManager';
import { StudyRoom } from './features/community/StudyRoom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { XpShop } from './features/shop/XpShop';
import { SkillForest } from './features/visualization/SkillForest';
import { LearningDuels } from './features/community/LearningDuels';
import { DailySprint } from './features/dashboard/DailySprint';
import { LearningTrackCard } from './components/ui/LearningTrackCard';
import { apiService } from './services/api.service';
import { KnowledgeMap } from './features/visualization/KnowledgeMap';
import TeacherDashboard from './features/dashboard/TeacherDashboard';
import CreatorDashboard from './features/dashboard/CreatorDashboard';

const Home = () => {
  const { modules, loading: modulesLoading, error: modulesError } = useModules();
  const { challenge, isCompleted, loading: challengeLoading } = useDailyChallenge();
  const { progress } = useProgress();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'forest' | 'map'>('grid');
  const [tracks, setTracks] = useState<any[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await apiService.getAllTracks();
        setTracks(data);
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      } finally {
        setLoadingTracks(false);
      }
    };
    fetchTracks();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/courses/search?q=${searchQuery}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(modules.map((m: any) => m.category)));
    return ['All', ...uniqueCats.sort()];
  }, [modules]);

  const filteredModules = useMemo(() => {
    if (searchQuery.length >= 2) return searchResults;
    if (selectedCategory === 'All') return modules;
    return modules.filter((m: any) => m.category === selectedCategory);
  }, [modules, selectedCategory, searchResults, searchQuery]);

  const mapData = useMemo(() => {
    const nodes = modules.map((m: any) => ({
      id: m.id,
      title: m.title,
      category: m.category,
      status: ((progress as any)?.history?.some((h: any) => h.courseId === m.id) ? 'completed' : 'available') as 'completed' | 'available' | 'locked'
    }));

    const links: any[] = [];
    modules.forEach((m: any, i: number) => {
      if (i > 0 && m.category === modules[i - 1].category) {
        links.push({ source: modules[i - 1].id, target: m.id });
      }
    });

    return { nodes, links };
  }, [modules, progress]);

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

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode('forest')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${viewMode === 'forest' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Skill Forest ✨
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${viewMode === 'map' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Conceptual Map 🧠
        </button>
      </div>

      <div className="mb-12">
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
            <span className="text-xl">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search courses by topic, title, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl leading-5 focus:outline-none focus:border-black focus:ring-0 sm:text-lg font-medium transition-all shadow-sm hover:border-gray-200"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {!searchQuery && tracks.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Learning Tracks</h2>
              <p className="text-gray-600 font-medium">Guided paths to master complex subjects.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">←</div>
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-black">→</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tracks.map(track => (
              <LearningTrackCard key={track._id} track={track} progress={Math.floor(Math.random() * 40)} />
            ))}
          </div>
        </div>
      )}

      <DailySprint />

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

      {viewMode === 'map' ? (
        <KnowledgeMap data={mapData} onNodeClick={(id) => navigate(`/module/${id}`)} />
      ) : viewMode === 'grid' ? (
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
      ) : (
        <SkillForest
          courses={modules as any}
          completedCourseIds={(progress as any).history?.map((h: any) => h.courseId) || []}
        />
      )}
    </PageTransition>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">B</div>
            <span>BrilliantClone</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Explore</Link>
              <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">My Progress</Link>
              <Link to="/leaderboard" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Leaderboard</Link>
              <Link to="/duels" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Duels ⚔️</Link>
              <Link to="/shop" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">XP Shop</Link>
              <Link to="/study-room/general" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">Study Rooms</Link>
              {user?.role === 'teacher' && (
                <Link to="/teacher-dashboard" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Teacher ✨</Link>
              )}
              {(user?.role === 'teacher' || user?.role === 'admin') && (
                <Link to="/creator-dashboard" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Creator 🎨</Link>
              )}
            </div>
            <div className="h-6 w-[1px] bg-gray-100 hidden md:block"></div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-gray-900 hidden sm:block">Hi, {user.displayName}</span>
                <button
                  onClick={logout}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-black">Log in</Link>
                <Link to="/register" className="bg-black text-white px-5 py-2 rounded-xl text-sm font-black hover:bg-gray-800 transition-all active:scale-[0.98]">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProgressDashboard />} />
        <Route path="/module/:moduleId" element={<ModuleDetail />} />
        <Route path="/problem/:problemId" element={<InteractiveProblem />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/problems" element={<ProblemList />} />
        <Route path="/admin/problems/new" element={<ProblemEditor />} />
        <Route path="/admin/problems/edit/:id" element={<ProblemEditor />} />
        <Route path="/admin/courses" element={<CourseManager />} />
        <Route path="/study-room/:roomId" element={<StudyRoom />} />
        <Route path="/duels" element={<LearningDuels />} />
        <Route path="/shop" element={<XpShop />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
