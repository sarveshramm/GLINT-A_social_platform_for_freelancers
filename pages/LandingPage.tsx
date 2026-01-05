
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Zap, Layout as LayoutIcon, Code, Video, PenTool, Globe, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darkBg text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-primary/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-secondary/15 blur-[120px] rounded-full opacity-30"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-12"
          >
            <Sparkles size={14} />
            <span>The Era of the Skilled Creator</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[120px] font-black tracking-[-0.04em] mb-10 leading-[0.9]"
          >
            WHERE SKILLS<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-secondary animate-gradient-text">SHINE.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
          >
            GLINT is the high-performance social ecosystem where talent is discovered by what they build, not what they bid.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/signup" className="group px-12 py-6 bg-primary text-black font-black rounded-3xl flex items-center space-x-3 glow-orange hover:scale-105 transition-all shadow-2xl shadow-primary/20 tracking-widest text-xs">
              <span>JOIN THE ELITE</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-12 py-6 bg-white/5 border border-white/10 font-black rounded-3xl hover:bg-white/10 transition-all tracking-widest text-xs uppercase">
              Member Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Marks */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-12">Trusted by 50,000+ Industrial Professionals</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
            <div className="text-2xl font-black italic tracking-tighter">HYPERSTREAM</div>
            <div className="text-2xl font-black italic tracking-tighter">NEON.LABS</div>
            <div className="text-2xl font-black italic tracking-tighter">CORE.TECH</div>
            <div className="text-2xl font-black italic tracking-tighter">VFX.STUDIO</div>
            <div className="text-2xl font-black italic tracking-tighter">LUMINA</div>
          </div>
        </div>
      </section>

      {/* Featured Roles */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Built for the top 1%.</h2>
              <p className="text-gray-500 text-lg font-medium">We built GLINT to kill the resume. Show your actual output and let the work do the talking.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary"><Zap size={24} /></div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary"><Globe size={24} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Video Editors', icon: Video, desc: 'Reel-first discovery.' },
              { label: 'Developers', icon: Code, desc: 'Live code previews.' },
              { label: 'Designers', icon: PenTool, desc: 'High-fidelity portfolios.' },
              { label: 'AI Experts', icon: LayoutIcon, desc: 'Prompt engineering gems.' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-[48px] bg-darkCard border border-white/5 flex flex-col items-center text-center hover:border-primary/50 transition-all group shadow-xl"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-black transition-all shadow-inner">
                  <item.icon size={40} />
                </div>
                <h3 className="text-xl font-black mb-2">{item.label}</h3>
                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-darkCard to-black p-16 md:p-32 rounded-[80px] border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Sparkles size={300} />
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">Ready to<br/><span className="text-primary">Glint?</span></h2>
          <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto font-medium">Join the world's most talented pool of creative professionals and start getting hired for your real skills.</p>
          <Link to="/signup" className="inline-flex px-12 py-6 bg-white text-black font-black rounded-3xl hover:scale-105 transition-all tracking-widest text-xs">
            CREATE FREE ACCOUNT
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 5s ease infinite;
        }
      `}</style>
    </div>
  );
};
