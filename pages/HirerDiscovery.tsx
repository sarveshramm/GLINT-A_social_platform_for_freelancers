
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { User } from '../types';
import { Search, Mail, CheckCircle, ArrowUpRight, Sparkles, Filter, Users, Layout as LayoutIcon, Code, Video, Palette, BrainCircuit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const CATEGORIES = [
  { id: 'all', label: 'All Talent', icon: Users },
  { id: 'editors', label: 'Editors', icon: Video, tags: ['Video Editing', 'Motion Graphics', 'VFX'] },
  { id: 'developers', label: 'Developers', icon: Code, tags: ['React', 'TypeScript', 'Backend', 'Web'] },
  { id: 'designers', label: 'Designers', icon: Palette, tags: ['Branding', 'UI/UX', 'Product Design'] },
  { id: 'ai', label: 'AI/Tech', icon: Sparkles, tags: ['AI', 'Prompt Engineering', 'Generative'] },
];

export const HirerDiscovery: React.FC = () => {
  const [creators, setCreators] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [matchingResults, setMatchingResults] = useState<User[] | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const cat = CATEGORIES.find(c => c.id === selectedCat);
    const filtered = DataService.searchCreators(query, cat?.id !== 'all' ? cat?.tags || [] : []);
    setCreators(filtered);
  }, [query, selectedCat]);

  const viewProfile = (id: string) => navigate(`/profile/${id}`);

  const handleAiMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsMatchingLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Get all creator data to feed into the model (simplified for the prompt)
      const allCreators = DataService.searchCreators('', []);
      const creatorsContext = allCreators.map(c => ({
        id: c.id,
        name: c.name,
        skills: c.skillTags,
        bio: c.bio
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are GLINT AI Matchmaker. A client needs a specific talent.
        Client Request: "${aiPrompt}"
        Available Talent Pool: ${JSON.stringify(creatorsContext)}
        
        Based ONLY on the talent pool provided, identify the top 3 matches. Return ONLY a comma-separated list of their IDs. If no matches exist, return "none".`,
      });

      const matchedIds = response.text?.trim().split(',').map(id => id.trim()) || [];
      if (matchedIds[0] === 'none') {
        setMatchingResults([]);
      } else {
        const found = allCreators.filter(c => matchedIds.includes(c.id));
        setMatchingResults(found);
      }
    } catch (err) {
      console.error(err);
      alert("AI Matching failed. Try again.");
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const activeDisplayList = matchingResults || creators;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0">
      {/* Search Header */}
      <div className="mb-12 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            <span>Discover Top 1% Global Creators</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">Assemble Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Dream Team</span></h2>
          <p className="text-gray-500 text-lg md:text-xl font-medium mb-10 max-w-2xl">Skip the bidding spam. GLINT connects you directly with high-caliber talent through their actual craft.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
          <div className="relative group flex-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[32px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-8 text-gray-400 group-focus-within:text-primary transition-all scale-110" size={24} />
              <input 
                type="text" 
                placeholder="Search by name, skill, or expertise..."
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setMatchingResults(null);
                }}
                className="w-full h-20 pl-20 pr-8 bg-white dark:bg-darkCard border border-gray-100 dark:border-white/10 rounded-[32px] shadow-2xl focus:outline-none focus:border-primary font-bold text-xl transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
          <button 
            onClick={() => setIsAiMatching(true)}
            className="h-20 px-8 bg-secondary text-white rounded-[32px] flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs glow-purple hover:scale-105 transition-all shadow-2xl"
          >
            <BrainCircuit size={24} />
            <span>AI MATCH</span>
          </button>
        </div>
      </div>

      {/* Category Quick Filters */}
      {!matchingResults && (
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 border-2 ${
                selectedCat === cat.id 
                  ? 'bg-primary text-black border-primary glow-orange' 
                  : 'bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {matchingResults && (
        <div className="mb-12 flex items-center justify-between bg-secondary/5 p-6 rounded-[32px] border border-secondary/20">
          <div className="flex items-center gap-4">
            <BrainCircuit size={24} className="text-secondary" />
            <p className="font-bold text-secondary">AI Matches for: <span className="italic">"{aiPrompt}"</span></p>
          </div>
          <button onClick={() => setMatchingResults(null)} className="p-2 hover:bg-secondary/10 rounded-full transition-colors text-secondary">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Talent Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
        <AnimatePresence mode="popLayout">
          {activeDisplayList.length > 0 ? (
            activeDisplayList.map((creator, idx) => (
              <motion.div 
                layout
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/10 p-10 rounded-[48px] group hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <ArrowUpRight size={24} className="text-primary" />
                </div>
                
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <img 
                      src={creator.avatar || `https://ui-avatars.com/api/?name=${creator.name}`} 
                      className="w-24 h-24 rounded-[32px] object-cover ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all shadow-xl cursor-pointer" 
                      alt="" 
                      onClick={() => viewProfile(creator.id)}
                    />
                    {creator.availability && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-darkCard rounded-full shadow-lg"></div>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      DataService.startOrGetChat('me', creator.id); 
                      navigate('/messages');
                    }}
                    className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-gray-400 group-hover:scale-110"
                  >
                    <Mail size={22} />
                  </button>
                </div>

                <div className="mb-8 cursor-pointer flex-1" onClick={() => viewProfile(creator.id)}>
                  <h3 className="text-3xl font-black flex items-center gap-2 group-hover:text-primary transition-colors mb-3 leading-none">
                    {creator.name}
                    <CheckCircle size={20} className="text-blue-500" />
                  </h3>
                  <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-3 leading-relaxed">{creator.bio}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {creator.skillTags.slice(0, 4).map(tag => (
                      <span key={tag} className="text-[10px] font-black px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10 group-hover:border-primary/20 transition-all uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-gray-100 dark:border-white/10 mt-auto">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Estimated Rate</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">${creator.rateCard?.hourly || 40}<span className="text-sm font-bold text-gray-400 ml-1 italic">/hr</span></p>
                  </div>
                  <button 
                    onClick={() => viewProfile(creator.id)}
                    className="px-8 py-4 bg-primary text-black font-black text-xs rounded-2xl glow-orange hover:scale-105 transition-all uppercase tracking-widest shadow-xl shadow-primary/10"
                  >
                    HIRE ME
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center opacity-30">
              <Search size={80} className="mx-auto mb-8" />
              <h3 className="text-3xl font-black mb-4">No matching talent found</h3>
              <p className="text-lg font-medium">Try broadening your search or adjusting categories.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Match Dialog */}
      <AnimatePresence>
        {isAiMatching && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAiMatching(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-2xl bg-white dark:bg-darkCard rounded-[50px] p-12 shadow-2xl border border-white/10"
            >
              <button onClick={() => setIsAiMatching(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white">
                <X size={24} />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 mx-auto">
                  <BrainCircuit size={32} />
                </div>
                <h2 className="text-4xl font-black mb-2 tracking-tighter uppercase">AI MATCHMAKING</h2>
                <p className="text-gray-500 font-medium">Describe your dream project or specific talent needs.</p>
              </div>
              
              <form onSubmit={handleAiMatch} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Project Brief</label>
                  <textarea 
                    required
                    rows={4}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="e.g. I need a video editor who can do high-energy transition effects for a futuristic tech commercial..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl py-6 px-6 focus:border-secondary focus:outline-none font-bold text-lg resize-none"
                  />
                </div>
                <div className="pt-6">
                  <button 
                    disabled={isMatchingLoading}
                    type="submit" 
                    className="w-full py-6 bg-secondary text-white font-black rounded-3xl glow-purple hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50"
                  >
                    {isMatchingLoading ? 'MATCHING WITH POOL...' : 'IDENTIFY BEST TALENT'}
                  </button>
                </div>
                <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">GEMINI 3 PRO POWERED MATCHING</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
