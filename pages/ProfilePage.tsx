
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { User, UserRole, Post, ProjectItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, X, Globe, Github, Briefcase, Camera, Plus, CheckCircle, Mail, DollarSign, ExternalLink, Linkedin, Layout as LayoutIcon, Star } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { StorageService } from '../services/storageService';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isHiring, setIsHiring] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [hireTitle, setHireTitle] = useState('');
  const [hireBudget, setHireBudget] = useState('');

  const isOwnProfile = !id || id === currentUser?.id;
  const targetId = id || currentUser?.id;

  useEffect(() => {
    if (targetId) {
      const data = DataService.getUserById(targetId);
      if (data) {
        setProfile(data);
        const allPosts = DataService.getPosts();
        setPosts(allPosts.filter(p => p.creatorId === targetId));
      }
    }
  }, [id, currentUser, targetId]);

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const handleSave = () => {
    if (profile) {
      if (isOwnProfile) {
        updateUser(profile);
      } else {
        DataService.updateUser(profile);
      }
      setIsEditing(false);
    }
  };

  const handleUpdate = (field: keyof User, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleRateUpdate = (field: 'hourly' | 'project', value: number) => {
    if (profile) {
      setProfile({
        ...profile,
        rateCard: {
          ...(profile.rateCard || { hourly: 0, project: 0 }),
          [field]: value
        }
      });
    }
  };



  const handleMessage = () => {
    if (!currentUser) return navigate('/login');
    const chat = DataService.startOrGetChat(currentUser.id, profile.id);
    navigate('/messages');
  };

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');
    DataService.createHire(currentUser.id, profile.id, hireTitle, hireBudget);
    setIsHiring(false);
    alert('Hire request sent successfully!');
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() && profile) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!profile.skillTags.includes(newTag)) {
        setProfile({ ...profile, skillTags: [...profile.skillTags, newTag] });
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    if (profile) {
      setProfile({ ...profile, skillTags: profile.skillTags.filter(tag => tag !== tagToRemove) });
    }
  };

  const handleAddProject = () => {
    if (profile) {
      const newProject: ProjectItem = {
        id: Date.now().toString(),
        title: 'New Project',
        description: 'Description of your amazing work.',
        link: ''
      };
      setProfile({ ...profile, projects: [...(profile.projects || []), newProject] });
    }
  };

  const handleUpdateProject = (pid: string, field: keyof ProjectItem, val: string) => {
    if (profile) {
      setProfile({
        ...profile,
        projects: (profile.projects || []).map(p => p.id === pid ? { ...p, [field]: val } : p)
      });
    }
  };

  const handleRemoveProject = (pid: string) => {
    if (profile) {
      setProfile({ ...profile, projects: (profile.projects || []).filter(p => p.id !== pid) });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner' | 'project', projectId?: string) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      try {
        const path = projectId ? `users/${profile.id}/projects/${projectId}` : `users/${profile.id}/${field}`;
        const url = await StorageService.uploadFile(file, path);

        if (field === 'project' && projectId) {
          handleUpdateProject(projectId, 'thumbnail', url);
        } else {
          setProfile({ ...profile, [field]: url });
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Upload failed. Please try a smaller image.");
      } finally {
        // Reset input so same file can be selected again
        e.target.value = '';
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Banner Section */}
        <div className="h-64 md:h-80 bg-gradient-to-br from-gray-800 to-black rounded-[40px] overflow-hidden relative shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite] z-20 pointer-events-none"></div>
          {profile.banner ? (
            <img src={profile.banner} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30 text-white font-black text-4xl uppercase">B A N N E R</div>
          )}

          {isEditing && (
            <>
              <input type="file" id="bannerUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'banner')} />
              <button
                onClick={() => document.getElementById('bannerUpload')?.click()}
                className="absolute bottom-4 right-4 p-3 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-colors z-10"
              >
                <Camera size={20} />
              </button>
            </>
          )}
        </div>

        {/* Profile Info Section - Positioned below banner with Avatar overlap */}
        <div className="px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">

            {/* Avatar - Pulling it up to overlap banner */}
            <div className="relative -mt-24 z-10 shrink-0">
              <div className="relative group p-1.5 bg-[#000000] rounded-[42px]">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}`}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-[36px] object-cover shadow-2xl bg-gray-800"
                  alt="Avatar"
                />
                {isEditing && (
                  <>
                    <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                    <button
                      onClick={() => document.getElementById('avatarUpload')?.click()}
                      className="absolute bottom-4 right-4 p-3 bg-primary text-black rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Details & Actions - Sitting nicely below banner */}
            <div className="flex-1 w-full pt-4 md:pt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">

              {/* Text Info */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="space-y-3 w-full max-w-md">
                    <input
                      value={profile.name}
                      onChange={(e) => handleUpdate('name', e.target.value)}
                      className="text-4xl font-black tracking-tighter bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full text-white"
                      placeholder="Your Name"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-bold text-lg">@</span>
                      <input
                        value={profile.username}
                        onChange={(e) => handleUpdate('username', e.target.value)}
                        className="text-gray-500 font-bold tracking-tight text-lg bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full"
                        placeholder="username"
                      />
                    </div>
                    <input
                      value={profile.title || ''}
                      onChange={(e) => handleUpdate('title', e.target.value)}
                      className="text-sm font-bold uppercase tracking-widest bg-transparent border-b border-white/20 focus:border-primary focus:outline-none w-full text-gray-400"
                      placeholder="PROFESSIONAL TITLE"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white">{profile.name}</h1>
                      <CheckCircle size={28} className="text-primary fill-primary/20" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-500 font-bold text-lg tracking-tight">@{profile.username}</p>
                      <p className="text-sm font-black uppercase tracking-widest text-primary pt-1">{profile.title || "Creator"}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black rounded-full uppercase tracking-widest">
                    {profile.role}
                  </span>
                  {profile.availability && (
                    <span className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {isOwnProfile ? (
                  isEditing ? (
                    <>
                      <button onClick={handleSave} className="flex-1 md:flex-none px-8 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 glow-orange hover:scale-[1.02] transition-all">
                        <Save size={18} />
                        <span>SAVE</span>
                      </button>
                      <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-colors">
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      {currentUser?.role === UserRole.CREATOR && (
                        <button
                          onClick={() => navigate('/creator/create-post')}
                          className="px-8 py-4 bg-primary/10 text-primary border border-primary/20 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/20 transition-all uppercase tracking-widest text-xs"
                        >
                          <Plus size={18} />
                          <span>Post Work</span>
                        </button>
                      )}
                      <button onClick={() => setIsEditing(true)} className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 font-black rounded-2xl flex items-center justify-center gap-2 transition-all text-white uppercase tracking-widest text-xs">
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                      </button>
                    </>
                  )
                ) : (
                  <>
                    {currentUser && (
                      <button
                        onClick={() => {
                          const isFollowing = currentUser.following?.includes(profile.id);
                          if (isFollowing) {
                            const updatedMe = DataService.unfollowUser(currentUser.id, profile.id);
                            if (updatedMe) updateUser(updatedMe);
                          } else {
                            const updatedMe = DataService.followUser(currentUser.id, profile.id);
                            if (updatedMe) updateUser(updatedMe);
                          }
                          setProfile({ ...profile });
                        }}
                        className={`px-8 py-4 font-black rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-xs ${currentUser.following?.includes(profile.id)
                          ? 'bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 text-white'
                          : 'bg-white text-black hover:bg-gray-200'
                          }`}
                      >
                        {currentUser.following?.includes(profile.id) ? 'Following' : 'Follow'}
                      </button>
                    )}

                    <button onClick={handleMessage} className="px-8 py-4 bg-white/5 border border-white/10 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-white uppercase tracking-widest text-xs">
                      <Mail size={18} />
                      <span>Message</span>
                    </button>
                    {currentUser?.role === UserRole.HIRER && profile.role === UserRole.CREATOR && (
                      <button onClick={() => setIsHiring(true)} className="px-8 py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 glow-orange hover:scale-[1.02] transition-all uppercase tracking-widest text-xs">
                        <Briefcase size={18} />
                        <span>Hire Now</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Identity & Vision</h3>
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 text-sm min-h-[120px] focus:outline-none focus:border-primary transition-all font-medium"
                  value={profile.bio}
                  onChange={e => handleUpdate('bio', e.target.value)}
                  placeholder="Tell the world what you do best..."
                />
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">My Skills (Press Enter to Add)</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                    placeholder="Add skill..."
                    onKeyDown={handleAddSkill}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.skillTags.map(tag => (
                      <button key={tag} onClick={() => handleRemoveSkill(tag)} className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full hover:bg-red-500 hover:text-white transition-colors">
                        {tag} <X size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-medium italic">"{profile.bio || "Crafting excellence behind every pixel."}"</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.skillTags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-[10px] font-black text-gray-500 rounded-2xl uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>



          {/* Socials */}
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Digital Presence</h3>
            {/* Portfolio & Socials - Simplified to Single Portfolio as requested */}
            {isEditing ? (
              <div className="mt-6 space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Portfolio URL</label>
                <input
                  value={profile.portfolioUrl || ''}
                  onChange={(e) => handleUpdate('portfolioUrl', e.target.value)}
                  placeholder="https://yourparamount.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:outline-none font-medium"
                />
              </div>
            ) : (
              <div className="flex gap-4 mt-6">
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 text-white hover:bg-white/10 transition-colors uppercase tracking-widest text-[10px] font-black">
                    <Globe size={16} />
                    PORTFOLIO
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects Section - NEW */}
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Featured Projects</h3>
              {isEditing && <button onClick={handleAddProject} className="text-primary text-[10px] font-black uppercase flex items-center gap-1 hover:text-white"><Plus size={14} /> Add Project</button>}
            </div>

            {profile.projects && profile.projects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {profile.projects.map(project => (
                  <div key={project.id} className="relative group bg-gray-50 dark:bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all">
                    {isEditing && <button onClick={() => handleRemoveProject(project.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full z-20 hover:scale-110"><X size={12} /></button>}
                    <div className="h-48 bg-gray-200 dark:bg-black/20 relative">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} className="w-full h-full object-cover" alt={project.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold uppercase tracking-widest">No Preview</div>
                      )}
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <input type="file" id={`p-${project.id}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'project', project.id)} />
                          <button onClick={() => document.getElementById(`p-${project.id}`)?.click()} className="text-white bg-primary/20 p-3 rounded-full backdrop-blur-md"><Camera size={20} /></button>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {isEditing ? (
                        <>
                          <input value={project.title} onChange={e => handleUpdateProject(project.id, 'title', e.target.value)} className="w-full bg-transparent font-bold mb-2 border-b border-white/10 focus:border-primary focus:outline-none" placeholder="Project Title" />
                          <textarea value={project.description} onChange={e => handleUpdateProject(project.id, 'description', e.target.value)} className="w-full bg-transparent text-sm text-gray-500 border-b border-white/10 h-20 focus:border-primary focus:outline-none resize-none" placeholder="Description..." />
                          <input value={project.link || ''} onChange={e => handleUpdateProject(project.id, 'link', e.target.value)} className="w-full bg-transparent text-xs text-blue-400 mt-2 border-b border-white/10 focus:border-primary focus:outline-none" placeholder="https://..." />
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-lg leading-tight mb-2">{project.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{project.description}</p>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:underline">
                              View Logic <ExternalLink size={10} />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-400 font-medium">No projects showcasing brilliance yet.</p>
                {isOwnProfile && !isEditing && <p className="text-primary text-sm mt-2 font-bold cursor-pointer" onClick={() => setIsEditing(true)}>Edit profile to add projects</p>}
              </div>
            )}
          </div>

          {/* Posts Section */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Recent Broadcasts</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {posts.length > 0 ? posts.map((post, idx) => (
                <div key={post.id}>
                  <PostCard post={post} />
                </div>
              )) : (
                <div className="col-span-2 text-center text-gray-500 py-10">
                  <p>No broadcasts yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20 border-t border-white/10 pt-10">
            <h3 className="text-2xl font-black tracking-tighter text-white mb-8 uppercase">Client Reviews</h3>

            {/* Add Review Box for Hirers */}
            {!isOwnProfile && currentUser?.role === UserRole.HIRER && (
              <div className="mb-10 bg-white/5 border border-white/10 p-6 rounded-3xl">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Leave a Review</h4>
                <textarea
                  id="reviewComment"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:outline-none mb-4 resize-none"
                  rows={3}
                  placeholder="Share your experience working with this creator..."
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} className="text-primary hover:scale-110 transition-transform"><Star size={20} fill="currentColor" /></button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const text = (document.getElementById('reviewComment') as HTMLTextAreaElement).value;
                      if (!text) return;
                      const newReview = {
                        id: Date.now().toString(),
                        reviewerId: currentUser.id,
                        reviewerName: currentUser.name,
                        reviewerAvatar: currentUser.avatar,
                        targetId: profile.id,
                        rating: 5, // Default for now, can implement state
                        comment: text,
                        timestamp: Date.now()
                      };
                      const updatedReviews = [...(profile.reviews || []), newReview];
                      handleUpdate('reviews', updatedReviews);
                      (document.getElementById('reviewComment') as HTMLTextAreaElement).value = ''; // Reset
                    }}
                    className="px-6 py-3 bg-primary text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {profile.reviews && profile.reviews.length > 0 ? (
                profile.reviews.map((review: any) => (
                  <div key={review.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={review.reviewerAvatar || `https://ui-avatars.com/api/?name=${review.reviewerName}`} className="w-10 h-10 rounded-full bg-gray-700" alt="" />
                        <div>
                          <h5 className="text-sm font-bold text-white">{review.reviewerName}</h5>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(review.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-primary">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-10 text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hire Modal */}
      <AnimatePresence>
        {isHiring && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsHiring(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-darkCard rounded-[40px] p-12 border border-white/10 z-10 shadow-2xl">
              <button onClick={() => setIsHiring(false)} className="absolute top-8 right-8 text-gray-400 hover:text-white"><X size={24} /></button>
              <div className="mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4"><Briefcase size={32} /></div>
                <h2 className="text-3xl font-black text-white">Hire {profile.name}</h2>
                <p className="text-gray-500">Kickstart your next big thing.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Payment Simulation
                const payAmount = parseInt(hireBudget.replace(/[^0-9]/g, '')) || 0;
                if (payAmount <= 0) { alert("Please enter a valid budget amount."); return; }

                const websiteComm = payAmount * 0.10;
                const creatorPay = payAmount * 0.90;

                alert(`PAYMENT SUCCESSFUL!\n\nTotal Paid: $${payAmount}\nWebsite Commission (10%): $${websiteComm}\nSent to Creator: $${creatorPay}\n\nProject '${hireTitle}' has been started!`);

                setIsHiring(false);
                // In a real app, we would dispatch these transactions to the DB
              }} className="space-y-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Service Fee</span>
                    <span className="text-xs font-bold text-gray-400">10%</span>
                  </div>
                  <p className="text-xs text-gray-500">Secure payment protection & platform support.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Project Title</label>
                  <input value={hireTitle} onChange={e => setHireTitle(e.target.value)} required placeholder="e.g. Redesign Landing Page" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500">Budget ($)</label>
                  <input value={hireBudget} onChange={e => setHireBudget(e.target.value)} required placeholder="e.g. 5000" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:outline-none font-bold text-white" />
                </div>
                <button type="submit" className="w-full py-5 mt-4 bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-xs">Initialize Payment & Hire</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
         @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
         .animate-gradient { animation: gradient 8s ease infinite; }
       `}</style>
    </div >
  );
};
