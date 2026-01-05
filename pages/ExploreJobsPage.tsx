
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { Job } from '../types';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Clock, MapPin, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExploreJobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (user) {
      const allJobs = DataService.getJobs().filter(j => j.status === 'open');
      setJobs(allJobs);
    }
  }, [user]);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(filter.toLowerCase()) || 
    j.requiredSkills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleApply = (hirerId: string) => {
    // Application is simulated by opening a chat with the hirer
    if (!user) return;
    DataService.startOrGetChat(user.id, hirerId);
    navigate('/messages');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-black mb-4 tracking-tighter">Explore Opportunities</h2>
        <p className="text-gray-500 mb-8">Direct job posts from companies and individuals looking for your talent.</p>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter by skill or title..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:border-primary focus:outline-none font-bold"
            />
          </div>
          <button className="px-6 bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Filter size={20} />
            <span className="font-bold">Filters</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 rounded-[32px] hover:border-primary/30 transition-all flex flex-col md:flex-row justify-between gap-8 group shadow-sm hover:shadow-xl"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                    Matching Skill
                  </span>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(job.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(s => (
                    <span key={s} className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-[10px] font-black text-gray-400 border border-gray-100 dark:border-white/5">
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between md:h-full gap-6 shrink-0">
                <div className="md:text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Budget</p>
                  <p className="text-2xl font-black text-primary">{job.budgetRange}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1 md:justify-end">
                    <MapPin size={12} />
                    <span>Remote</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleApply(job.hirerId)}
                  className="w-full md:w-auto px-8 py-4 bg-primary text-black font-black rounded-2xl glow-orange hover:scale-105 transition-all"
                >
                  APPLY NOW
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center opacity-30">
            <Briefcase size={64} className="mx-auto mb-6" />
            <h3 className="text-xl font-bold">No jobs found</h3>
            <p>Try refining your search or adding more skills to your profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};
