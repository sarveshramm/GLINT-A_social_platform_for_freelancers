
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { DataService } from '../services/dataService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageService } from '../services/storageService';
import { Video, Image as ImageIcon, Code, FileText, Send, X, Plus, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const CreatePostPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'video' | 'case_study' | 'code'>('image');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('https://picsum.photos/seed/newpost/1200/800');
  const [aiImagePrompt, setAiImagePrompt] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAiAssist = async () => {
    if (!title) return alert("Please enter a title first.");
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a punchy, professional social media description for: ${title}. Skills: ${tags.join(', ')}. Max 150 chars.`,
      });
      if (response.text) {
        setDescription(response.text.trim());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!aiImagePrompt) return alert("Please describe the image you want.");
    setIsImageGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High-end professional portfolio shot, ${aiImagePrompt}. Clean, modern, tech-focused aesthetic.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          setMediaUrl(base64);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please check your API key.");
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    DataService.createPost({
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      title,
      description,
      type,
      mediaUrl,
      skillTags: tags,
    });

    navigate('/creator/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <h2 className="text-5xl font-black tracking-tighter mb-4">Post Your <span className="text-primary">Masterpiece</span></h2>
        <p className="text-gray-500 text-xl font-medium">Show the world what you built today.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[48px] p-10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'image', label: 'Image', icon: ImageIcon },
                  { id: 'video', label: 'Reel', icon: Video },
                  { id: 'code', label: 'Code', icon: Code },
                  { id: 'case_study', label: 'Study', icon: FileText },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`p-4 rounded-3xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${type === item.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-50 dark:border-white/5 text-gray-400 hover:border-gray-200 dark:hover:border-white/10'
                      }`}
                  >
                    <item.icon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Project Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Neon Horizon VFX Breakdown"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary font-bold text-lg"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                    <button
                      type="button"
                      onClick={handleAiAssist}
                      disabled={isAiGenerating || !title}
                      className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-30"
                    >
                      <Sparkles size={14} />
                      {isAiGenerating ? 'AI Magic...' : 'AI ASSIST'}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the workflow and tech used..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary font-medium resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Expertise Tags</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-white/5">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type skill and press enter..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-primary font-bold text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-primary text-black font-black rounded-3xl glow-orange hover:scale-[1.02] transition-all shadow-xl tracking-widest text-xs uppercase"
              >
                BROADCAST TO FEED
              </button>
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden shadow-xl">
            <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Media Preview</h3>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="mediaUpload"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsImageGenerating(true);
                      try {
                        const url = await StorageService.uploadFile(file, 'posts');
                        setMediaUrl(url);
                        setType(file.type.startsWith('video') ? 'video' : 'image');
                      } catch (err) {
                        alert("Upload failed. Ensure you have the .env.local keys for Firebase.");
                      } finally {
                        setIsImageGenerating(false);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('mediaUpload')?.click()}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Upload
                </button>
                <button onClick={() => setMediaUrl('https://picsum.photos/seed/' + Date.now() + '/1200/800')} className="text-gray-400 hover:text-white transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
            <div className="aspect-video relative group bg-black flex items-center justify-center">
              {type === 'video' || (mediaUrl && mediaUrl.startsWith('data:video')) ? (
                <video src={mediaUrl} className="w-full h-full object-contain" controls />
              ) : (
                <img src={mediaUrl} className="w-full h-full object-cover" alt="Preview" />
              )}
              {isImageGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="mx-auto text-primary animate-bounce mb-4" size={32} />
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Synthesizing Media...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Gemini Image Forge</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiImagePrompt}
                  onChange={e => setAiImagePrompt(e.target.value)}
                  placeholder="Describe your art (e.g. 'Cyberpunk street in rain')..."
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 focus:outline-none focus:border-secondary font-medium text-sm"
                />
                <button
                  onClick={handleGenerateImage}
                  disabled={isImageGenerating}
                  className="w-14 h-14 bg-secondary text-white rounded-2xl flex items-center justify-center glow-purple hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Wand2 size={24} />
                </button>
              </div>
              <p className="mt-4 text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">AI GENERATED MEDIA FOR PROFESSIONAL PORTFOLIOS</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-orange-600 p-8 rounded-[40px] text-black shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Plus size={120} /></div>
            <h4 className="text-xl font-black mb-2 tracking-tighter uppercase">PRO REACH</h4>
            <p className="text-xs font-bold mb-6 opacity-80 leading-relaxed">Upgrade to Glint Pro to have your posts pinned to the top of the global discovery feed for 48 hours.</p>
            <button onClick={() => navigate('/plans')} className="w-full py-4 bg-black text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">BOOST MY POST</button>
          </div>
        </div>
      </div>
    </div>
  );
};
