
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, ShieldCheck, Sparkles, Star, Target } from 'lucide-react';

export const MonetizationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-0">
      <div className="text-center mb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Crown size={14} />
          <span>Unlock Your Full Potential</span>
        </motion.div>
        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-secondary">Glint.</span></h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Precision tools and amplified visibility for the world's most elite creative professionals.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-32">
        {/* Basic Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-12 rounded-[60px] flex flex-col group hover:border-white/20 transition-all"
        >
          <div className="mb-12">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-gray-400 mb-8 group-hover:scale-110 transition-transform">
              <Target size={32} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ESSENTIAL</p>
            <h3 className="text-4xl font-black mb-2 tracking-tighter">FREE</h3>
            <p className="text-gray-500 text-sm font-medium">Industrial standard features to get your journey started.</p>
          </div>
          <div className="space-y-6 mb-16 flex-1">
            <FeatureItem text="Verified Identity Profile" />
            <FeatureItem text="Standard Portfolio Showcase" />
            <FeatureItem text="5 Monthly Post Uploads" />
            <FeatureItem text="Basic Job Discovery" />
          </div>
          <button className="w-full py-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl font-black text-[10px] uppercase tracking-widest text-gray-400 cursor-default">
            CURRENT ACCESS
          </button>
        </motion.div>

        {/* Pro Plan (Creator) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-darkCard border-[3px] border-primary p-12 rounded-[60px] flex flex-col relative shadow-2xl scale-105 z-10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl"></div>
          
          <div className="mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 animate-pulse shadow-inner">
              <Zap size={32} />
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">FOR CREATORS</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-4xl font-black tracking-tighter">GLINT PRO</h3>
              <span className="text-gray-500 font-bold text-lg">$12/mo</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Amplified visibility and elite showcase tools.</p>
          </div>
          <div className="space-y-6 mb-16 flex-1">
            <FeatureItem text="Premium 'Glint Pro' Badge" highlight />
            <FeatureItem text="Featured Ranking in Discovery" highlight />
            <FeatureItem text="Unlimited High-Resolution Posts" />
            <FeatureItem text="Real-time Audience Analytics" />
            <FeatureItem text="Custom Visual Brand Themes" />
            <FeatureItem text="Direct Portfolio Exports" />
          </div>
          <button className="w-full py-6 bg-primary text-black font-black rounded-3xl glow-orange hover:scale-105 transition-all shadow-2xl shadow-primary/20 uppercase tracking-widest text-[10px]">
            UPGRADE TO PRO
          </button>
        </motion.div>

        {/* Business Plan (Hirer) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 p-12 rounded-[60px] flex flex-col group hover:border-secondary/50 transition-all"
        >
          <div className="mb-12">
            <div className="w-16 h-16 bg-secondary/10 rounded-3xl flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
              <Sparkles size={32} />
            </div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">FOR HIRERS</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-4xl font-black tracking-tighter">BUSINESS</h3>
              <span className="text-gray-500 font-bold text-lg">$49/mo</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Precision recruiting for high-stakes industries.</p>
          </div>
          <div className="space-y-6 mb-16 flex-1">
            <FeatureItem text="Unlimited Job Listings" />
            <FeatureItem text="AI Matchmaker Premium Access" />
            <FeatureItem text="Advanced Talent Filtering" />
            <FeatureItem text="Dedicated Account Manager" />
            <FeatureItem text="Mass-Collaborator Dashboard" />
          </div>
          <button className="w-full py-6 bg-secondary text-white font-black rounded-3xl glow-purple hover:scale-105 transition-all uppercase tracking-widest text-[10px] shadow-2xl shadow-secondary/20">
            ENTERPRISE ACCESS
          </button>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-32">
        <div className="bg-white/5 border border-white/5 p-12 rounded-[60px] flex flex-col items-center text-center">
          <ShieldCheck size={48} className="text-primary mb-6" />
          <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Secure Ecosystem</h4>
          <p className="text-gray-500 font-medium">All financial transactions are handled through industrial-grade encryption. GLINT protects your investment and ensures creator payment security.</p>
        </div>
        <div className="bg-white/5 border border-white/5 p-12 rounded-[60px] flex flex-col items-center text-center">
          <Rocket size={48} className="text-secondary mb-6" />
          <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Growth Engine</h4>
          <p className="text-gray-500 font-medium">Our platform isn't just a site, it's a career accelerator. 85% of GLINT Pro members report high-quality hire leads within their first 14 days.</p>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mb-20">Simulation Mode: No real charges will be applied during Beta.</p>
    </div>
  );
};

const FeatureItem = ({ text, highlight }: { text: string, highlight?: boolean }) => (
  <div className="flex items-center gap-4">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${highlight ? 'bg-primary/20 text-primary' : 'bg-green-500/10 text-green-500'}`}>
      <Check size={14} strokeWidth={3} />
    </div>
    <span className={`text-sm font-bold ${highlight ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{text}</span>
  </div>
);
