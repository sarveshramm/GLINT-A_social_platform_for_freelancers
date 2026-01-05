
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { Job } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, Clock, Trash2, CheckCircle } from 'lucide-react';

export const HirerJobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      setJobs(DataService.getJobsByHirer(user.id));
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black mb-2 tracking-tighter">My Job Postings</h2>
          <p className="text-gray-500">Manage your active projects and discover talent.</p>
        </div>
        <Link to="/hirer/post-job" className="px-8 py-4 bg-secondary text-white font-black rounded-2xl flex items-center gap-3 glow-purple hover:scale-[1.02] transition-all">
          <Plus size={20} />
          <span>NEW POST</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-8 rounded-[32px] hover:border-secondary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    job.status === 'open' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-xs text-gray-400">{new Date(job.timestamp).toLocaleDateString()}</p>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map(s => (
                    <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-bold text-gray-500">
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between md:h-full gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Budget</p>
                  <p className="text-xl font-black text-secondary">{job.budgetRange}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                  </button>
                  <button className="px-6 py-3 bg-secondary/10 text-secondary font-black rounded-xl hover:bg-secondary hover:text-white transition-all">
                    MANAGE
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-gray-50 dark:bg-darkCard/30 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/5">
            <Briefcase size={64} className="mx-auto text-gray-200 dark:text-white/5 mb-6" />
            <h3 className="text-xl font-bold mb-2">No active jobs</h3>
            <p className="text-gray-500 mb-8">Post your first project to start finding talent.</p>
            <Link to="/hirer/post-job" className="inline-flex items-center gap-2 text-secondary font-bold">
              <span>Post a job now</span>
              <Plus size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
