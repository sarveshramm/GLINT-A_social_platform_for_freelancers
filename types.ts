
export enum UserRole {
  CREATOR = 'CREATOR',
  HIRER = 'HIRER',
  UNSET = 'UNSET'
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  link?: string;
  thumbnail?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  targetId: string;
  rating: number; // 1-5
  comment: string;
  timestamp: number;
}

export interface Transaction {
  id: string;
  fromId: string;
  toId: string;
  amount: number; // Full amount paid/received
  type: 'payment' | 'commission';
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  avatar?: string;
  banner?: string;
  bio?: string;
  title?: string;
  location?: string;
  experienceLevel?: 'Junior' | 'Intermediate' | 'Senior' | 'Director';
  skillTags: string[];
  projects?: ProjectItem[];
  rateCard?: {
    hourly: number;
    project: number;
  };
  portfolioUrl?: string; // Single Portfolio Link
  balance?: number; // Wallet Balance
  reviews?: Review[]; // Received Reviews
  availability?: boolean;
  following: string[];
  followers: string[];
  createdAt: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  type: 'image' | 'video' | 'case_study' | 'code';
  title: string;
  description: string;
  skillTags: string[];
  mediaUrl: string;
  likes: string[]; // User IDs
  saves: string[]; // User IDs
  commentCount: number;
  timestamp: number;
}

export interface Job {
  id: string;
  hirerId: string;
  hirerName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budgetRange: string;
  timeline: string;
  status: 'open' | 'active' | 'completed';
  timestamp: number;
}

export interface Hire {
  id: string;
  creatorId: string;
  hirerId: string;
  jobTitle: string;
  budget: string;
  status: 'requested' | 'active' | 'completed';
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'follow' | 'view' | 'job_match' | 'message' | 'hire';
  message: string;
  fromUserId?: string;
  fromUserName?: string;
  timestamp: number;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: string;
  updatedAt: number;
}
