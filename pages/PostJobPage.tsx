
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Calendar, Target, Plus, X, Sparkles, Layout as LayoutIcon, Globe, Shield } from 'lucide-react';

export const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    DataService.createJob({
      hirerId: user.id,
      hirerName: user.name,
      title,
      description,
      budgetRange: budget,
      timeline,
      requiredSkills: skills
    });

    navigate('/hirer/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} />
          <span>Post a Mission to the Global Talent Pool</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-none">Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Catalyst.</span></h2>
        <p className="text-gray-500 text-xl font-medium max-w-xl">Detailed briefs attract elite creators. Tell the world what you're building.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[60px] p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Professional Title</label>
                  <input 
                    required
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Senior Unreal Engine 5 Environment Artist"
                    className="w-full h-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-6 focus:border-secondary focus:outline-none font-bold text-lg transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Project Scope & Details</label>
                  <textarea 
                    required
                    rows={8}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide a deep dive into the technical requirements, expected deliverables, and project vision..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[32px] py-6 px-6 focus:border-secondary focus:outline-none font-medium resize-none leading-relaxed text-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Investment Range</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="e.g. $5,000 - $10,000"
                        className="w-full h-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 focus:border-secondary focus:outline-none font-black text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Execution Timeline</label>
                    <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text"
                        value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        placeholder="e.g. 4 Weeks Mission"
                        className="w-full h-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 focus:border-secondary focus:outline-none font-black text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Required Expertise (Press Enter)</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map(s => (
                      <span key={s} className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter(i => i !== s))} className="hover:text-red-500 transition-colors"><X size={14}/></button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text"
                    value={currentSkill}
                    onChange={e => setCurrentSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. Blender, Unreal Engine, Rust, Next.js"
                    className="w-full h-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-6 focus:border-secondary focus:outline-none font-bold text-lg"
                  />
                </div>
              </div>

              <div className="pt-10">
                <button className="w-full h-20 bg-secondary text-white font-black rounded-3xl glow-purple hover:scale-[1.02] transition-all shadow-2xl shadow-secondary/20 uppercase tracking-[0.2em] text-xs">
                  BROADCAST MISSION
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-10 rounded-[50px] shadow-sm">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Hirer Best Practices</h4>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0"><Target size={24} /></div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-tighter mb-1">Be Specific</h5>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Top creators skip vague briefs. Detail your technical requirements clearly.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shrink-0"><Globe size={24} /></div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-tighter mb-1">Global Reach</h5>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Your job will be visible to creators across 140+ countries instantly.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shrink-0"><Shield size={24} /></div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-tighter mb-1">Secure Hiring</h5>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Use GLINT's built-in contracts to ensure intellectual property protection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2D0050] to-black p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><LayoutIcon size={120} /></div>
            <h4 className="text-2xl font-black mb-4 tracking-tighter">Need an AI Assist?</h4>
            <p className="text-sm text-purple-200 mb-8 font-medium leading-relaxed">Upgrade to Business to get AI-powered talent recommendations and brief optimization.</p>
            <button 
              onClick={() => navigate('/plans')}
              className="w-full py-5 bg-white text-secondary font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
            >
              UPGRADE TO BUSINESS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
