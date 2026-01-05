
import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { DataService } from '../services/dataService';
import { Post, UserRole, Job, Hire } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Sparkles, Briefcase, Zap, ChevronRight, CheckCircle, Search, Rocket } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [matchingJobs, setMatchingJobs] = useState<Job[]>([]);
  const [activeHires, setActiveHires] = useState<Hire[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (user) {
      setPosts(DataService.getFeedForUser(user.id));
      if (user.role === UserRole.CREATOR) {
        setMatchingJobs(DataService.getMatchingJobsForCreator(user.id).slice(0, 3));
      }
      setActiveHires(DataService.getHires(user.id).filter(h => h.status === 'active').slice(0, 3));
    } else {
      setPosts(DataService.getPosts());
    }
  }, [user]);

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPosts(prev => [...prev, ...DataService.getPosts()]);
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
            <div className="flex space-x-10">
              <button className="text-xs font-black border-b-4 border-primary pb-4 -mb-[20px] tracking-widest uppercase text-primary">FOR YOU</button>
              <button className="text-xs font-black text-gray-400 hover:text-gray-900 dark:hover:text-white pb-4 -mb-[20px] tracking-widest uppercase transition-colors">FOLLOWING</button>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <Users size={16} />
              <span>{DataService.getUsers().length} ACTIVE GLINTERS</span>
            </div>
          </div>

          <div className="space-y-4">
            {posts.length > 0 ? (
              <>
                {posts.map((post, idx) => (
                  <PostCard key={`${post.id}-${idx}`} post={post} />
                ))}

                <div className="py-16 text-center">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-12 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all disabled:opacity-50 glow-white"
                  >
                    {isLoadingMore ? 'BRIGHTENING FEED...' : 'LOAD MORE INSPIRATION'}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-40 text-center bg-gray-50 dark:bg-darkCard/30 rounded-[60px] border border-dashed border-gray-100 dark:border-white/5">
                <Sparkles size={80} className="mx-auto text-primary opacity-20 mb-8 animate-pulse" />
                <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">Your feed is evolving</h3>
                <p className="text-gray-500 font-bold max-w-sm mx-auto">Follow creators and skills to see their magic appear in your daily digest.</p>
                <Link to="/discover" className="mt-10 px-8 py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-xs glow-orange inline-flex items-center gap-2 hover:scale-105 transition-all">
                  <span>Explore Discovery</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebars */}
        <div className="hidden lg:block w-80 shrink-0 space-y-8">
          {/* Quick Hirer Widget */}
          {user?.role === UserRole.HIRER && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-secondary to-[#2D0050] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Search size={80} /></div>
              <h3 className="font-black text-xl mb-3 tracking-tighter">Need Specific Talent?</h3>
              <p className="text-xs text-purple-200 mb-6 font-medium leading-relaxed">Search 20,000+ vetted editors, developers, and creators instantly.</p>
              <button
                onClick={() => navigate('/hirer/discover')}
                className="w-full py-4 bg-white text-secondary font-black text-xs rounded-2xl uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
              >
                START DISCOVERY
              </button>
            </motion.div>
          )}

          {/* Role Specific Sidebar for Creators */}
          {user?.role === UserRole.CREATOR && matchingJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-sm relative"
            >
              <div className="absolute top-4 right-4 animate-pulse"><Zap size={20} className="text-primary" /></div>
              <h3 className="font-black text-[10px] uppercase tracking-widest text-primary mb-6">
                MATCHING OPPORTUNITIES
              </h3>
              <div className="space-y-6">
                {matchingJobs.map(job => (
                  <Link key={job.id} to="/jobs" className="block group border-b border-gray-50 dark:border-white/5 pb-4 last:border-0">
                    <p className="text-sm font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">{job.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{job.budgetRange}</span>
                      <span className="text-[10px] font-black text-primary group-hover:underline">VIEW JOB</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Management for both */}
          {activeHires.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-sm"
            >
              <h3 className="font-black text-[10px] uppercase tracking-widest text-green-500 mb-6 flex items-center gap-2">
                <CheckCircle size={16} />
                In Progress
              </h3>
              <div className="space-y-6">
                {activeHires.map(hire => (
                  <div key={hire.id} className="block group border-b border-gray-50 dark:border-white/5 pb-4 last:border-0">
                    <p className="text-sm font-black line-clamp-1 mb-1">{hire.jobTitle}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">ACTIVE</span>
                      </div>
                      <Link to="/messages" className="text-[10px] font-black text-primary hover:underline">OPEN CHAT</Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trending creators - Constant for both */}
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 rounded-[40px] shadow-sm">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-secondary mb-6 flex items-center gap-2">
              <TrendingUp size={16} />
              Featured Talent
            </h3>
            <div className="space-y-6">
              {DataService.searchCreators('', []).slice(0, 4).map((creator) => (
                <div key={creator.id} onClick={() => navigate(`/profile/${creator.id}`)} className="flex items-center space-x-4 group cursor-pointer border-b border-gray-50 dark:border-white/5 pb-4 last:border-0">
                  <div className="relative shrink-0">
                    <img src={creator.avatar} className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-white/10 shadow-sm" alt="" />
                    {creator.availability && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-darkCard rounded-full"></div>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black group-hover:text-primary transition-colors truncate">{creator.name}</p>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest truncate">{creator.skillTags[0]}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/discover" className="mt-8 block text-center text-[10px] font-black text-gray-400 hover:text-primary transition-all tracking-widest uppercase border-t border-gray-100 dark:border-white/5 pt-6">
              Full Discovery Catalog
            </Link>
          </div>

          {/* Pro Ad */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-primary via-secondary to-primary bg-[length:200%_200%] p-[3px] rounded-[44px] overflow-hidden shadow-2xl animate-gradient"
          >
            <div className="bg-white dark:bg-darkCard p-8 h-full w-full flex flex-col items-center text-center rounded-[41px]">
              <div className="w-14 h-14 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary mb-5 shadow-inner">
                <Rocket size={28} />
              </div>
              <h3 className="font-black text-xl mb-2 tracking-tight uppercase">GLINT ELITE</h3>
              <p className="text-[10px] text-gray-500 mb-8 font-black uppercase tracking-widest leading-relaxed">Industrial Grade Perks for Premium Users</p>
              <Link to="/plans" className="w-full py-4 bg-primary text-black text-xs font-black rounded-2xl glow-orange tracking-widest uppercase shadow-xl hover:bg-white transition-all">UPGRADE NOW</Link>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .glow-white {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};
