
import React from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { User, Briefcase, ChevronRight } from 'lucide-react';

export const RoleSelectPage: React.FC = () => {
  const { updateRole } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (role: UserRole) => {
    updateRole(role);
    navigate(role === UserRole.CREATOR ? '/creator/dashboard' : '/hirer/dashboard');
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Choose Your Path</h2>
          <p className="text-xl text-gray-500">How do you want to use GLINT?</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.button 
            whileHover={{ y: -10 }}
            onClick={() => handleSelect(UserRole.CREATOR)}
            className="group p-10 rounded-[40px] bg-darkCard border-2 border-white/5 hover:border-primary transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
              <User size={120} />
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
              <User size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2">Creator Account</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Editors, Developers, Designers. Show off your work and get hired directly.
            </p>
            <div className="inline-flex items-center text-primary font-bold space-x-2">
              <span>Start creating</span>
              <ChevronRight size={20} />
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ y: -10 }}
            onClick={() => handleSelect(UserRole.HIRER)}
            className="group p-10 rounded-[40px] bg-darkCard border-2 border-white/5 hover:border-secondary transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
              <Briefcase size={120} />
            </div>
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8">
              <Briefcase size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2">Hirer Account</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Companies, Startups, Clients. Discover world-class talent and build your vision.
            </p>
            <div className="inline-flex items-center text-secondary font-bold space-x-2">
              <span>Post a job</span>
              <ChevronRight size={20} />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
