import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { DataService } from '../services/dataService';
import { Notification } from '../types';

interface NotificationContextType {
    messageCount: number;
    activityCount: number;
    profileCount: number;
    refreshCounts: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    messageCount: 0,
    activityCount: 0,
    profileCount: 0,
    refreshCounts: () => { },
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [messageCount, setMessageCount] = useState(0);
    const [activityCount, setActivityCount] = useState(0);
    const [profileCount, setProfileCount] = useState(0);

    const refreshCounts = useCallback(async () => {
        if (!user) {
            setMessageCount(0);
            setActivityCount(0);
            setProfileCount(0);
            return;
        }

        const notifications = await DataService.getNotifications(user.id);
        const unread = notifications.filter(n => !n.read);

        // Messages: Count unread notifications of type 'message'
        const msgs = unread.filter(n => n.type === 'message').length;

        // Activity: Count unread notifications of other types
        const activity = unread.filter(n => n.type !== 'message').length;

        // Profile: Count missing critical fields
        let profile = 0;
        if (!user.title) profile++;
        if (!user.bio) profile++;
        if (!user.location) profile++;
        if (!user.avatar) profile++;
        if (user.skillTags.length === 0) profile++;
        // Project completion suggestion
        if (!user.projects || user.projects.length === 0) profile++;

        setMessageCount(msgs);
        setActivityCount(activity);
        setProfileCount(profile);
    }, [user]);

    useEffect(() => {
        refreshCounts();
        // Poll every 10 seconds to update counts (reduced frequency for Supabase)
        const interval = setInterval(refreshCounts, 10000);
        return () => clearInterval(interval);
    }, [user, refreshCounts]);

    return (
        <NotificationContext.Provider value={{ messageCount, activityCount, profileCount, refreshCounts }}>
            {children}
        </NotificationContext.Provider>
    );
};
