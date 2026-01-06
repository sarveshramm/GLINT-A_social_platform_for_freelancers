
import { Storage } from './storage';
import { Post, Job, Notification, User, Chat, ChatMessage, UserRole, Comment, Hire } from '../types';
import { MOCK_POSTS, MOCK_JOBS, MOCK_USERS } from '../constants';

export const initializeData = () => {
  if (!Storage.get('posts')) Storage.set('posts', MOCK_POSTS);
  if (!Storage.get('jobs')) Storage.set('jobs', MOCK_JOBS);
  if (!Storage.get('notifications')) Storage.set('notifications', []);
  if (!Storage.get('chats')) Storage.set('chats', []);
  if (!Storage.get('messages')) Storage.set('messages', []);
  if (!Storage.get('comments')) Storage.set('comments', []);
  if (!Storage.get('users')) Storage.set('users', MOCK_USERS);
  if (!Storage.get('hires')) Storage.set('hires', []);
};

export const DataService = {
  // Posts
  getPosts: (): Post[] => {
    const posts = Storage.get<Post[]>('posts') || [];
    return posts.sort((a, b) => {
      const aScore = a.likes.length + a.saves.length + a.commentCount;
      const bScore = b.likes.length + b.saves.length + b.commentCount;
      return (bScore - aScore) || (b.timestamp - a.timestamp);
    });
  },
  getPostById: (id: string) => DataService.getPosts().find(p => p.id === id),
  createPost: (post: Omit<Post, 'id' | 'likes' | 'saves' | 'commentCount' | 'timestamp'>) => {
    const posts = Storage.get<Post[]>('posts') || [];
    const newPost: Post = {
      ...post,
      id: `post_${Date.now()}`,
      likes: [],
      saves: [],
      commentCount: 0,
      timestamp: Date.now()
    };
    Storage.set('posts', [newPost, ...posts]);
    return newPost;
  },
  toggleLikePost: (postId: string, userId: string) => {
    const posts = Storage.get<Post[]>('posts') || [];
    const updated = posts.map(p => {
      if (p.id === postId) {
        const liked = p.likes.includes(userId);
        if (!liked) {
          DataService.addNotification({
            userId: p.creatorId,
            type: 'like',
            message: `Someone liked your post: ${p.title}`,
            fromUserId: userId,
          });
        }
        return {
          ...p,
          likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
        };
      }
      return p;
    });
    Storage.set('posts', updated);
  },
  getComments: (postId: string): Comment[] => {
    const all = Storage.get<Comment[]>('comments') || [];
    return all.filter(c => c.postId === postId).sort((a, b) => b.timestamp - a.timestamp);
  },
  addComment: (postId: string, userId: string, userName: string, text: string) => {
    const comments = Storage.get<Comment[]>('comments') || [];
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      userId,
      userName,
      text,
      timestamp: Date.now()
    };
    Storage.set('comments', [newComment, ...comments]);
    const posts = Storage.get<Post[]>('posts') || [];
    Storage.set('posts', posts.map(p => p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p));
  },

  // Jobs
  getJobs: (): Job[] => Storage.get<Job[]>('jobs') || [],
  getJobsByHirer: (hirerId: string): Job[] => DataService.getJobs().filter(j => j.hirerId === hirerId),
  getMatchingJobsForCreator: (creatorId: string): Job[] => {
    const creator = DataService.getUserById(creatorId);
    if (!creator) return [];
    return DataService.getJobs().filter(j =>
      j.status === 'open' && j.requiredSkills.some(s => creator.skillTags.includes(s))
    );
  },
  createJob: (job: Omit<Job, 'id' | 'status' | 'timestamp'>) => {
    const jobs = DataService.getJobs();
    const newJob: Job = {
      ...job,
      id: `job_${Date.now()}`,
      status: 'open',
      timestamp: Date.now()
    };
    Storage.set('jobs', [newJob, ...jobs]);
    const users = Storage.get<User[]>('users') || [];
    users.filter(u => u.role === UserRole.CREATOR && u.skillTags.some(s => job.requiredSkills.includes(s)))
      .forEach(creator => {
        DataService.addNotification({
          userId: creator.id,
          type: 'job_match',
          message: `New job matching your skills: ${job.title}`,
          fromUserId: job.hirerId,
          fromUserName: job.hirerName
        });
      });
    return newJob;
  },

  // Hires
  getHires: (userId: string): Hire[] => {
    const all = Storage.get<Hire[]>('hires') || [];
    return all.filter(h => h.hirerId === userId || h.creatorId === userId).sort((a, b) => b.timestamp - a.timestamp);
  },
  createHire: (hirerId: string, creatorId: string, jobTitle: string, budget: string) => {
    const hires = Storage.get<Hire[]>('hires') || [];
    const newHire: Hire = {
      id: `hire_${Date.now()}`,
      hirerId,
      creatorId,
      jobTitle,
      budget,
      status: 'requested',
      timestamp: Date.now()
    };
    Storage.set('hires', [newHire, ...hires]);
    const hirer = DataService.getUserById(hirerId);
    DataService.addNotification({
      userId: creatorId,
      type: 'hire',
      message: `${hirer?.name} sent you a hire request for: ${jobTitle}`,
      fromUserId: hirerId,
      fromUserName: hirer?.name
    });
    return newHire;
  },
  updateHireStatus: (hireId: string, status: Hire['status']) => {
    const hires = Storage.get<Hire[]>('hires') || [];
    const updated = hires.map(h => {
      if (h.id === hireId) {
        const hirer = DataService.getUserById(h.hirerId);
        const creator = DataService.getUserById(h.creatorId);

        // Notify the other party
        const notifyId = h.status === 'requested' ? h.hirerId : (status === 'completed' ? h.hirerId : h.creatorId);
        DataService.addNotification({
          userId: notifyId,
          type: 'hire',
          message: `Project "${h.jobTitle}" is now ${status.toUpperCase()}`,
        });

        return { ...h, status };
      }
      return h;
    });
    Storage.set('hires', updated);
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const all = Storage.get<Notification[]>('notifications') || [];
    return all.filter(n => n.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
  },
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const all = Storage.get<Notification[]>('notifications') || [];
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: Date.now(),
      read: false
    };
    Storage.set('notifications', [newNotif, ...all]);
  },
  markNotificationsAsRead: (userId: string, typeFilter?: 'message' | 'activity') => {
    const all = Storage.get<Notification[]>('notifications') || [];
    Storage.set('notifications', all.map(n => {
      if (n.userId !== userId) return n;

      // If filtering for messages, only mark messages
      if (typeFilter === 'message' && n.type === 'message') return { ...n, read: true };

      // If filtering for activity, only mark non-messages
      if (typeFilter === 'activity' && n.type !== 'message') return { ...n, read: true };

      // If no filter, mark all (legacy behavior or 'mark all read' button)
      if (!typeFilter) return { ...n, read: true };

      return n;
    }));
  },

  // Profile
  getUsers: (): User[] => Storage.get<User[]>('users') || [],
  getUserById: (id: string): User | undefined => {
    const users = DataService.getUsers();
    return users.find(u => u.id === id);
  },
  updateUser: (updatedUser: User) => {
    const users = DataService.getUsers();
    const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    Storage.set('users', updated);
  },

  // Messaging
  getChats: (userId: string): Chat[] => {
    const all = Storage.get<Chat[]>('chats') || [];
    return all.filter(c => c.participants.includes(userId)).sort((a, b) => b.updatedAt - a.updatedAt);
  },
  getMessages: (chatId: string): ChatMessage[] => {
    const all = Storage.get<ChatMessage[]>('messages') || [];
    return all.filter(m => m.chatId === chatId).sort((a, b) => a.timestamp - b.timestamp);
  },
  sendMessage: (chatId: string, senderId: string, senderName: string, text: string) => {
    const chats = Storage.get<Chat[]>('chats') || [];
    const messages = Storage.get<ChatMessage[]>('messages') || [];
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId,
      senderName,
      text,
      timestamp: Date.now()
    };
    Storage.set('messages', [...messages, newMsg]);
    Storage.set('chats', chats.map(c => c.id === chatId ? { ...c, lastMessage: text, updatedAt: Date.now() } : c));
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const recipientId = chat.participants.find(p => p !== senderId);
      if (recipientId) {
        DataService.addNotification({
          userId: recipientId,
          type: 'message',
          message: `New message from ${senderName}`,
          fromUserId: senderId,
          fromUserName: senderName
        });
      }
    }
  },
  startOrGetChat: (userId: string, otherUserId: string): Chat => {
    const chats = Storage.get<Chat[]>('chats') || [];
    const existing = chats.find(c => c.participants.includes(userId) && c.participants.includes(otherUserId));
    if (existing) return existing;
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants: [userId, otherUserId],
      updatedAt: Date.now()
    };
    Storage.set('chats', [newChat, ...chats]);
    return newChat;
  },

  // Discovery
  searchCreators: (query: string, skills: string[]) => {
    const users = DataService.getUsers();
    return users.filter(u =>
      u.role === UserRole.CREATOR &&
      (query === '' || u.name.toLowerCase().includes(query.toLowerCase()) || u.skillTags.some(s => s.toLowerCase().includes(query.toLowerCase()))) &&
      (skills.length === 0 || skills.some(s => u.skillTags.includes(s)))
    );
  },

  // Social Graph
  followUser: (followerId: string, targetId: string) => {
    const users = DataService.getUsers();

    // Update follower
    const follower = users.find(u => u.id === followerId);
    if (!follower) return;
    if (!follower.following) follower.following = [];
    if (!follower.following.includes(targetId)) {
      follower.following.push(targetId);
    }

    // Update target
    const target = users.find(u => u.id === targetId);
    if (!target) return;
    if (!target.followers) target.followers = [];
    if (!target.followers.includes(followerId)) {
      target.followers.push(followerId);

      // Notify target
      DataService.addNotification({
        userId: targetId,
        type: 'follow',
        message: `${follower.name} started following you`,
        fromUserId: followerId,
        fromUserName: follower.name
      });
    }

    DataService.updateUser(follower);
    DataService.updateUser(target);
    // Return updated follower to update app state if needed
    return follower;
  },

  unfollowUser: (followerId: string, targetId: string) => {
    const users = DataService.getUsers();

    // Update follower
    const follower = users.find(u => u.id === followerId);
    if (!follower) return;
    if (follower.following) {
      follower.following = follower.following.filter(id => id !== targetId);
    }

    // Update target
    const target = users.find(u => u.id === targetId);
    if (!target) return;
    if (target.followers) {
      target.followers = target.followers.filter(id => id !== followerId);
    }

    DataService.updateUser(follower);
    DataService.updateUser(target);
    return follower;
  },

  getFeedForUser: (userId: string): Post[] => {
    const user = DataService.getUserById(userId);
    const allPosts = DataService.getPosts();
    if (!user) return allPosts;

    const following = user.following || [];

    // 1. Posts from following
    const followingPosts = allPosts.filter(p => following.includes(p.creatorId));

    // 2. Own posts
    const ownPosts = allPosts.filter(p => p.creatorId === userId);

    // 3. Recommended (High engagement posts not from following)
    const otherPosts = allPosts.filter(p => !following.includes(p.creatorId) && p.creatorId !== userId)
      .sort((a, b) => (b.likes.length + b.commentCount) - (a.likes.length + a.commentCount))
      .slice(0, 10); // Mix in top 10 others

    // Merge and sort by time
    const feed = [...followingPosts, ...ownPosts, ...otherPosts];
    // Remove duplicates if any logic overlap
    const uniqueFeed = Array.from(new Set(feed.map(p => p.id))).map(id => feed.find(p => p.id === id)!);

    return uniqueFeed.sort((a, b) => b.timestamp - a.timestamp);
  }
};
