
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { Notification } from '../types';
import { motion } from 'framer-motion';
import { Heart, UserPlus, Briefcase, Mail, Eye, Bell } from 'lucide-react';

import { useNotifications } from '../components/NotificationContext';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { refreshCounts } = useNotifications();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      setNotifs(DataService.getNotifications(user.id).filter(n => n.type !== 'message'));
      DataService.markNotificationsAsRead(user.id, 'activity');
      refreshCounts();
    }
  }, [user]);

  const IconMap = {
    like: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    follow: { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    view: { icon: Eye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    job_match: { icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    message: { icon: Mail, color: 'text-primary', bg: 'bg-primary/10' },
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
          <Bell size={32} className="text-primary" />
          Notifications
        </h2>
        <span className="px-3 py-1 bg-primary text-black font-black text-[10px] rounded-full">NEW</span>
      </div>

      <div className="space-y-4">
        {notifs.length > 0 ? (
          notifs.map(n => {
            const config = IconMap[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-3xl bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 flex items-start gap-4 transition-all ${!n.read ? 'border-l-4 border-l-primary shadow-lg' : ''}`}
              >
                <div className={`p-3 rounded-2xl shrink-0 ${config.bg} ${config.color}`}>
                  <config.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{n.message}</p>
                  <p className="text-xs text-gray-500">
                    {n.fromUserName && <span className="font-black text-gray-700 dark:text-gray-300">From {n.fromUserName}</span>}
                    {n.fromUserName && ' • '}
                    {new Date(n.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-30">
            <Bell size={64} className="mx-auto mb-6" />
            <h3 className="text-xl font-bold">Inbox Empty</h3>
            <p>We'll notify you when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
};
