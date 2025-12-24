
import { User, UserRole, Post, Job } from './types';

export const COLORS = {
  primary: '#FF8C00',
  secondary: '#4B0082',
  darkBg: '#000000',
  lightBg: '#FFFFFF',
};

export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    email: 'alex@creator.com',
    name: 'Alex Rivera',
    username: 'alex_edits',
    role: UserRole.CREATOR,
    avatar: 'https://picsum.photos/seed/alex/200/200',
    bio: 'Professional Video Editor | After Effects Wizard',
    skillTags: ['Video Editing', 'Motion Graphics', 'Color Grading'],
    experienceLevel: 'Senior',
    rateCard: { hourly: 45, project: 500 },
    availability: true,
    createdAt: Date.now(),
    following: [],
    followers: [],
    balance: 0,
    reviews: []
  },
  {
    id: 'user2',
    email: 'sarah@startup.com',
    name: 'Sarah Chen',
    username: 'sarah_founder',
    role: UserRole.HIRER,
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    bio: 'CEO at Lumina Tech',
    skillTags: ['Tech', 'Design', 'AI'],
    createdAt: Date.now(),
    following: [],
    followers: [],
    balance: 0,
    reviews: []
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post1',
    creatorId: 'user1',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://picsum.photos/seed/alex/200/200',
    type: 'video',
    title: 'Cyberpunk Aesthetic Edit',
    description: 'Exploration of neon vibes and glitch transitions for a music video project.',
    skillTags: ['Motion Graphics', 'After Effects'],
    mediaUrl: 'https://picsum.photos/seed/vfx/800/450',
    likes: ['user2'],
    saves: [],
    commentCount: 12,
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'post2',
    creatorId: 'user1',
    creatorName: 'Alex Rivera',
    creatorAvatar: 'https://picsum.photos/seed/alex/200/200',
    type: 'image',
    title: 'Minimalist Branding Concept',
    description: 'Clean, bold identity for a modern architectural firm.',
    skillTags: ['Graphic Design', 'Branding'],
    mediaUrl: 'https://picsum.photos/seed/design/800/800',
    likes: [],
    saves: ['user2'],
    commentCount: 5,
    timestamp: Date.now() - 7200000,
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    hirerId: 'user2',
    hirerName: 'Sarah Chen',
    title: 'Short Form Video Editor Needed',
    description: 'Looking for someone to edit high-energy TikTok/Reels content for a tech brand.',
    requiredSkills: ['Video Editing', 'Short Form Content'],
    budgetRange: '$500 - $1000',
    timeline: '2 weeks',
    status: 'open',
    timestamp: Date.now(),
  }
];
