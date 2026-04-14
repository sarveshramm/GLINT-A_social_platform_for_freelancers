
import { supabase } from './supabaseClient';
import { Post, Job, Notification, User, Chat, ChatMessage, UserRole, Comment, Hire } from '../types';

/**
 * Helper to convert snake_case DB rows to camelCase app types
 */
const mapUserFromDb = (row: any): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  username: row.username,
  role: row.role as UserRole,
  avatar: row.avatar,
  banner: row.banner,
  bio: row.bio,
  title: row.title,
  location: row.location,
  experienceLevel: row.experience_level,
  skillTags: row.skill_tags || [],
  projects: row.projects || [],
  rateCard: row.rate_card,
  portfolioUrl: row.portfolio_url,
  balance: row.balance || 0,
  reviews: row.reviews || [],
  availability: row.availability || false,
  following: row.following || [],
  followers: row.followers || [],
  createdAt: row.created_at,
});

const mapUserToDb = (user: User): any => ({
  id: user.id,
  email: user.email,
  name: user.name,
  username: user.username,
  role: user.role,
  avatar: user.avatar,
  banner: user.banner,
  bio: user.bio,
  title: user.title,
  location: user.location,
  experience_level: user.experienceLevel,
  skill_tags: user.skillTags || [],
  projects: user.projects || [],
  rate_card: user.rateCard,
  portfolio_url: user.portfolioUrl,
  balance: user.balance || 0,
  reviews: user.reviews || [],
  availability: user.availability || false,
  following: user.following || [],
  followers: user.followers || [],
  created_at: user.createdAt,
});

const mapPostFromDb = (row: any): Post => ({
  id: row.id,
  creatorId: row.creator_id,
  creatorName: row.creator_name,
  creatorAvatar: row.creator_avatar,
  type: row.type,
  title: row.title,
  description: row.description,
  skillTags: row.skill_tags || [],
  mediaUrl: row.media_url,
  likes: row.likes || [],
  saves: row.saves || [],
  commentCount: row.comment_count || 0,
  timestamp: row.timestamp,
});

const mapJobFromDb = (row: any): Job => ({
  id: row.id,
  hirerId: row.hirer_id,
  hirerName: row.hirer_name,
  title: row.title,
  description: row.description,
  requiredSkills: row.required_skills || [],
  budgetRange: row.budget_range,
  timeline: row.timeline,
  status: row.status,
  timestamp: row.timestamp,
});

const mapCommentFromDb = (row: any): Comment => ({
  id: row.id,
  postId: row.post_id,
  userId: row.user_id,
  userName: row.user_name,
  userAvatar: row.user_avatar,
  text: row.text,
  timestamp: row.timestamp,
});

const mapNotifFromDb = (row: any): Notification => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  message: row.message,
  fromUserId: row.from_user_id,
  fromUserName: row.from_user_name,
  timestamp: row.timestamp,
  read: row.read,
});

const mapChatFromDb = (row: any): Chat => ({
  id: row.id,
  participants: row.participants || [],
  lastMessage: row.last_message,
  updatedAt: row.updated_at,
});

const mapMessageFromDb = (row: any): ChatMessage => ({
  id: row.id,
  chatId: row.chat_id,
  senderId: row.sender_id,
  senderName: row.sender_name,
  text: row.text,
  timestamp: row.timestamp,
});

const mapHireFromDb = (row: any): Hire => ({
  id: row.id,
  creatorId: row.creator_id,
  hirerId: row.hirer_id,
  jobTitle: row.job_title,
  budget: row.budget,
  status: row.status,
  timestamp: row.timestamp,
});

export const DataService = {
  // Posts
  getPosts: async (): Promise<Post[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) { console.error('getPosts error:', error); return []; }
    const posts = (data || []).map(mapPostFromDb);
    return posts.sort((a, b) => {
      const aScore = a.likes.length + a.saves.length + a.commentCount;
      const bScore = b.likes.length + b.saves.length + b.commentCount;
      return (bScore - aScore) || (b.timestamp - a.timestamp);
    });
  },

  getPostById: async (id: string): Promise<Post | undefined> => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return mapPostFromDb(data);
  },

  createPost: async (post: Omit<Post, 'id' | 'likes' | 'saves' | 'commentCount' | 'timestamp'>): Promise<Post> => {
    const newPost = {
      id: `post_${Date.now()}`,
      creator_id: post.creatorId,
      creator_name: post.creatorName,
      creator_avatar: post.creatorAvatar,
      type: post.type,
      title: post.title,
      description: post.description,
      skill_tags: post.skillTags,
      media_url: post.mediaUrl,
      likes: [],
      saves: [],
      comment_count: 0,
      timestamp: Date.now(),
    };
    const { error } = await supabase.from('posts').insert(newPost);
    if (error) console.error('createPost error:', error);
    return mapPostFromDb(newPost);
  },

  toggleLikePost: async (postId: string, userId: string): Promise<void> => {
    const post = await DataService.getPostById(postId);
    if (!post) return;

    const liked = post.likes.includes(userId);
    const newLikes = liked
      ? post.likes.filter(id => id !== userId)
      : [...post.likes, userId];

    await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);

    if (!liked) {
      await DataService.addNotification({
        userId: post.creatorId,
        type: 'like',
        message: `Someone liked your post: ${post.title}`,
        fromUserId: userId,
      });
    }
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('timestamp', { ascending: false });
    if (error) { console.error('getComments error:', error); return []; }
    return (data || []).map(mapCommentFromDb);
  },

  addComment: async (postId: string, userId: string, userName: string, text: string): Promise<void> => {
    const newComment = {
      id: `comm_${Date.now()}`,
      post_id: postId,
      user_id: userId,
      user_name: userName,
      text,
      timestamp: Date.now(),
    };
    await supabase.from('comments').insert(newComment);

    // Increment comment count on the post
    const post = await DataService.getPostById(postId);
    if (post) {
      await supabase.from('posts').update({ comment_count: post.commentCount + 1 }).eq('id', postId);
    }
  },

  // Jobs
  getJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) { console.error('getJobs error:', error); return []; }
    return (data || []).map(mapJobFromDb);
  },

  getJobsByHirer: async (hirerId: string): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('hirer_id', hirerId)
      .order('timestamp', { ascending: false });
    if (error) { console.error('getJobsByHirer error:', error); return []; }
    return (data || []).map(mapJobFromDb);
  },

  getMatchingJobsForCreator: async (creatorId: string): Promise<Job[]> => {
    const creator = await DataService.getUserById(creatorId);
    if (!creator) return [];
    const allJobs = await DataService.getJobs();
    return allJobs.filter(j =>
      j.status === 'open' && j.requiredSkills.some(s => creator.skillTags.includes(s))
    );
  },

  createJob: async (job: Omit<Job, 'id' | 'status' | 'timestamp'>): Promise<Job> => {
    const newJob = {
      id: `job_${Date.now()}`,
      hirer_id: job.hirerId,
      hirer_name: job.hirerName,
      title: job.title,
      description: job.description,
      required_skills: job.requiredSkills,
      budget_range: job.budgetRange,
      timeline: job.timeline,
      status: 'open',
      timestamp: Date.now(),
    };
    await supabase.from('jobs').insert(newJob);

    // Notify matching creators
    const users = await DataService.getUsers();
    const matchingCreators = users.filter(
      u => u.role === UserRole.CREATOR && u.skillTags.some(s => job.requiredSkills.includes(s))
    );
    for (const creator of matchingCreators) {
      await DataService.addNotification({
        userId: creator.id,
        type: 'job_match',
        message: `New job matching your skills: ${job.title}`,
        fromUserId: job.hirerId,
        fromUserName: job.hirerName,
      });
    }

    return mapJobFromDb(newJob);
  },

  // Hires
  getHires: async (userId: string): Promise<Hire[]> => {
    const { data, error } = await supabase
      .from('hires')
      .select('*')
      .or(`hirer_id.eq.${userId},creator_id.eq.${userId}`)
      .order('timestamp', { ascending: false });
    if (error) { console.error('getHires error:', error); return []; }
    return (data || []).map(mapHireFromDb);
  },

  createHire: async (hirerId: string, creatorId: string, jobTitle: string, budget: string): Promise<Hire> => {
    const newHire = {
      id: `hire_${Date.now()}`,
      hirer_id: hirerId,
      creator_id: creatorId,
      job_title: jobTitle,
      budget,
      status: 'requested',
      timestamp: Date.now(),
    };
    await supabase.from('hires').insert(newHire);

    const hirer = await DataService.getUserById(hirerId);
    await DataService.addNotification({
      userId: creatorId,
      type: 'hire',
      message: `${hirer?.name} sent you a hire request for: ${jobTitle}`,
      fromUserId: hirerId,
      fromUserName: hirer?.name,
    });

    return mapHireFromDb(newHire);
  },

  updateHireStatus: async (hireId: string, status: Hire['status']): Promise<void> => {
    const { data } = await supabase.from('hires').select('*').eq('id', hireId).single();
    if (!data) return;

    await supabase.from('hires').update({ status }).eq('id', hireId);

    const notifyId = data.status === 'requested' ? data.hirer_id : (status === 'completed' ? data.hirer_id : data.creator_id);
    await DataService.addNotification({
      userId: notifyId,
      type: 'hire',
      message: `Project "${data.job_title}" is now ${status.toUpperCase()}`,
    });
  },

  // Notifications
  getNotifications: async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    if (error) { console.error('getNotifications error:', error); return []; }
    return (data || []).map(mapNotifFromDb);
  },

  addNotification: async (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> => {
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: notif.userId,
      type: notif.type,
      message: notif.message,
      from_user_id: notif.fromUserId,
      from_user_name: notif.fromUserName,
      timestamp: Date.now(),
      read: false,
    };
    await supabase.from('notifications').insert(newNotif);
  },

  markNotificationsAsRead: async (userId: string, typeFilter?: 'message' | 'activity'): Promise<void> => {
    let query = supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (typeFilter === 'message') {
      query = query.eq('type', 'message');
    } else if (typeFilter === 'activity') {
      query = query.neq('type', 'message');
    }

    await query;
  },

  // Profile
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) { console.error('getUsers error:', error); return []; }
    return (data || []).map(mapUserFromDb);
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return undefined;
    return mapUserFromDb(data);
  },

  updateUser: async (updatedUser: User): Promise<void> => {
    const dbUser = mapUserToDb(updatedUser);
    await supabase.from('users').update(dbUser).eq('id', updatedUser.id);
  },

  // Messaging
  getChats: async (userId: string): Promise<Chat[]> => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });
    if (error) { console.error('getChats error:', error); return []; }
    return (data || []).map(mapChatFromDb);
  },

  getMessages: async (chatId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });
    if (error) { console.error('getMessages error:', error); return []; }
    return (data || []).map(mapMessageFromDb);
  },

  sendMessage: async (chatId: string, senderId: string, senderName: string, text: string): Promise<void> => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      chat_id: chatId,
      sender_id: senderId,
      sender_name: senderName,
      text,
      timestamp: Date.now(),
    };
    await supabase.from('messages').insert(newMsg);
    await supabase.from('chats').update({ last_message: text, updated_at: Date.now() }).eq('id', chatId);

    // Notify recipient
    const { data: chatData } = await supabase.from('chats').select('*').eq('id', chatId).single();
    if (chatData) {
      const recipientId = (chatData.participants || []).find((p: string) => p !== senderId);
      if (recipientId) {
        await DataService.addNotification({
          userId: recipientId,
          type: 'message',
          message: `New message from ${senderName}`,
          fromUserId: senderId,
          fromUserName: senderName,
        });
      }
    }
  },

  startOrGetChat: async (userId: string, otherUserId: string): Promise<Chat> => {
    // Check for existing chat
    const { data: chats } = await supabase
      .from('chats')
      .select('*')
      .contains('participants', [userId])
      .contains('participants', [otherUserId]);
    
    const existing = (chats || []).find(
      (c: any) => c.participants.includes(userId) && c.participants.includes(otherUserId)
    );
    if (existing) return mapChatFromDb(existing);

    const newChat = {
      id: `chat_${Date.now()}`,
      participants: [userId, otherUserId],
      updated_at: Date.now(),
    };
    await supabase.from('chats').insert(newChat);
    return mapChatFromDb(newChat);
  },

  // Discovery
  searchCreators: async (query: string, skills: string[]): Promise<User[]> => {
    const users = await DataService.getUsers();
    return users.filter(u =>
      u.role === UserRole.CREATOR &&
      (query === '' || u.name.toLowerCase().includes(query.toLowerCase()) || u.skillTags.some(s => s.toLowerCase().includes(query.toLowerCase()))) &&
      (skills.length === 0 || skills.some(s => u.skillTags.includes(s)))
    );
  },

  // Social Graph
  followUser: async (followerId: string, targetId: string): Promise<User | undefined> => {
    const follower = await DataService.getUserById(followerId);
    const target = await DataService.getUserById(targetId);
    if (!follower || !target) return undefined;

    if (!follower.following) follower.following = [];
    if (!follower.following.includes(targetId)) {
      follower.following.push(targetId);
    }

    if (!target.followers) target.followers = [];
    if (!target.followers.includes(followerId)) {
      target.followers.push(followerId);
      await DataService.addNotification({
        userId: targetId,
        type: 'follow',
        message: `${follower.name} started following you`,
        fromUserId: followerId,
        fromUserName: follower.name,
      });
    }

    await DataService.updateUser(follower);
    await DataService.updateUser(target);
    return follower;
  },

  unfollowUser: async (followerId: string, targetId: string): Promise<User | undefined> => {
    const follower = await DataService.getUserById(followerId);
    const target = await DataService.getUserById(targetId);
    if (!follower || !target) return undefined;

    if (follower.following) {
      follower.following = follower.following.filter(id => id !== targetId);
    }
    if (target.followers) {
      target.followers = target.followers.filter(id => id !== followerId);
    }

    await DataService.updateUser(follower);
    await DataService.updateUser(target);
    return follower;
  },

  getFeedForUser: async (userId: string): Promise<Post[]> => {
    const user = await DataService.getUserById(userId);
    const allPosts = await DataService.getPosts();
    if (!user) return allPosts;

    const following = user.following || [];
    const followingPosts = allPosts.filter(p => following.includes(p.creatorId));
    const ownPosts = allPosts.filter(p => p.creatorId === userId);
    const otherPosts = allPosts.filter(p => !following.includes(p.creatorId) && p.creatorId !== userId)
      .sort((a, b) => (b.likes.length + b.commentCount) - (a.likes.length + a.commentCount))
      .slice(0, 10);

    const feed = [...followingPosts, ...ownPosts, ...otherPosts];
    const uniqueFeed = Array.from(new Set(feed.map(p => p.id))).map(id => feed.find(p => p.id === id)!);

    return uniqueFeed.sort((a, b) => b.timestamp - a.timestamp);
  },
};

/**
 * Initialize seed data — check if users table has data, if not, seed was handled by SQL schema
 */
export const initializeData = async (): Promise<void> => {
  // Data is pre-seeded via supabase_schema.sql — no-op here
  console.log('GLINT: Connected to Supabase');
};
