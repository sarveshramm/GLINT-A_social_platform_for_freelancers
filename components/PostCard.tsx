
import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Bookmark, Share2, PlayCircle, Code, FileText, Send, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataService } from '../services/dataService';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.id) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const isTrending = (post.likes.length + post.commentCount) > 10;

  useEffect(() => {
    if (showComments) {
      setComments(DataService.getComments(post.id));
    }
  }, [showComments, post.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    DataService.toggleLikePost(post.id, user.id);
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    DataService.addComment(post.id, user.id, user.name, newComment);
    setComments(DataService.getComments(post.id));
    setNewComment('');
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${post.creatorId}`);
  };

  const renderMedia = () => {
    switch (post.type) {
      case 'video':
        return (
          <div className="relative aspect-video bg-neutral-900 group-hover:brightness-110 transition-all cursor-pointer">
            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={64} className="text-white drop-shadow-lg" />
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest">
              REEL
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="aspect-video bg-[#1e1e1e] p-6 font-mono text-xs overflow-hidden relative cursor-pointer group-hover:border-primary/30 border border-transparent transition-all">
            <div className="flex items-center space-x-2 mb-4 opacity-50">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <code className="text-gray-300 block leading-relaxed">
              <span className="text-purple-400">export default function</span> <span className="text-yellow-400">GlintEffect</span>() {'{'}<br/>
              &nbsp;&nbsp;<span className="text-blue-400">const</span> [shine, setShine] = <span className="text-yellow-400">useState</span>(<span className="text-orange-400">true</span>);<br/>
              &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">{'<div className="glow-orange">'}</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-400">...Skill.Shine()</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">{'</div>'}</span><br/>
              &nbsp;&nbsp;);<br/>
              {'}'}
            </code>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent opacity-60"></div>
            <div className="absolute bottom-4 right-4 bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Code size={12} /> CODE DEMO
            </div>
          </div>
        );
      case 'case_study':
        return (
          <div className="aspect-video bg-gray-50 dark:bg-white/5 flex flex-col items-center justify-center p-8 text-center cursor-pointer group-hover:bg-primary/5 transition-all">
            <FileText size={48} className="text-gray-400 mb-4 group-hover:text-primary transition-colors" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Full Case Study</p>
            <p className="text-lg font-black mt-1">Impact Analysis & Workflow</p>
            <div className="absolute bottom-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              STUDY
            </div>
          </div>
        );
      default:
        return (
          <div className="relative aspect-video bg-gray-200 dark:bg-neutral-900 overflow-hidden cursor-pointer">
            <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden mb-8 group shadow-sm hover:shadow-2xl transition-all"
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={goToProfile}>
          <img src={post.creatorAvatar} alt={post.creatorName} className="w-10 h-10 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary transition-all" />
          <div>
            <h4 className="text-sm font-black group-hover:text-primary transition-colors">{post.creatorName}</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
              {new Date(post.timestamp).toLocaleDateString()} • {post.type.replace('_', ' ')}
            </p>
          </div>
        </div>
        {isTrending && (
          <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest animate-pulse">
            <TrendingUp size={14} />
            Trending
          </div>
        )}
      </div>

      <div onClick={() => setShowComments(!showComments)}>
        {renderMedia()}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2">{post.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.skillTags.map(tag => (
            <span key={tag} className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all cursor-default">
              #{tag.toUpperCase()}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-5">
          <div className="flex items-center space-x-8">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all hover:scale-110 ${isLiked ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={isLiked ? 0 : 2} />
              <span className="text-sm font-black">{likesCount}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 transition-all hover:scale-110 ${showComments ? 'text-secondary' : 'text-gray-500 hover:text-secondary'}`}
            >
              <MessageCircle size={22} />
              <span className="text-sm font-black">{post.commentCount}</span>
            </button>
          </div>
          <div className="flex items-center space-x-5 text-gray-500">
            <button className="hover:text-primary hover:scale-110 transition-all"><Bookmark size={22} /></button>
            <button className="hover:text-secondary hover:scale-110 transition-all"><Share2 size={22} /></button>
          </div>
        </div>

        {/* Comment Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 overflow-hidden"
            >
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary border border-transparent font-medium"
                />
                <button type="submit" className="p-3 bg-primary text-black rounded-2xl glow-orange hover:scale-105 transition-all">
                  <Send size={18} />
                </button>
              </form>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 shrink-0 overflow-hidden">
                        {comment.userAvatar ? <img src={comment.userAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{comment.userName[0]}</div>}
                      </div>
                      <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black">{comment.userName}</span>
                          <span className="text-[10px] text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-500 py-4 italic">No comments yet. Start the conversation!</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
