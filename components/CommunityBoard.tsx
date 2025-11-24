import React, { useState } from 'react';
import { Tag, Calendar, Megaphone, Plus, Sparkles, Heart } from 'lucide-react';
import { MOCK_POSTS } from '../constants';
import { CommunityPost } from '../types';
import { draftCommunityPost } from '../services/geminiService';

export const CommunityBoard: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS);
  const [isDrafting, setIsDrafting] = useState(false);
  
  // Draft State
  const [draftItem, setDraftItem] = useState('');
  const [draftDetails, setDraftDetails] = useState('');
  const [draftPrice, setDraftPrice] = useState('');
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!draftItem) return;
    setIsGenerating(true);
    const content = await draftCommunityPost(draftItem, draftDetails);
    setAiGeneratedContent(content);
    setIsGenerating(false);
  };

  const handlePost = () => {
    const newPost: CommunityPost = {
        id: Date.now().toString(),
        author: 'You (Unit 404)',
        title: `Selling: ${draftItem}`,
        price: draftPrice,
        content: aiGeneratedContent || draftDetails,
        type: 'SALE',
        likes: 0
    };
    setPosts([newPost, ...posts]);
    setIsDrafting(false);
    // Reset
    setDraftItem('');
    setDraftDetails('');
    setDraftPrice('');
    setAiGeneratedContent('');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden fade-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Plaza Community</h2>
                <p className="text-xs text-slate-500 mt-1">Marketplace • Events • Updates</p>
            </div>
            <button 
                onClick={() => setIsDrafting(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors"
            >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
            {isDrafting ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in slide-in-from-bottom-5">
                    <h3 className="font-semibold text-slate-800 mb-4">Create Marketplace Listing</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Item Name</label>
                            <input 
                                type="text" 
                                value={draftItem}
                                onChange={(e) => setDraftItem(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                placeholder="E.g., Vintage Lamp"
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                                <input 
                                    type="text" 
                                    value={draftPrice}
                                    onChange={(e) => setDraftPrice(e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    placeholder="$100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Details (Rough Notes)</label>
                            <textarea 
                                value={draftDetails}
                                onChange={(e) => setDraftDetails(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none h-20"
                                placeholder="Good condition, pickup only..."
                            />
                        </div>

                        {aiGeneratedContent && (
                            <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles className="w-3 h-3 text-sky-500" />
                                    <span className="text-xs font-bold text-sky-600">AI Suggested Description</span>
                                </div>
                                <p className="text-sm text-slate-700 italic">{aiGeneratedContent}</p>
                            </div>
                        )}

                        <div className="flex justify-between pt-2">
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !draftItem}
                                className="text-sky-600 text-sm font-medium hover:text-sky-700 flex items-center space-x-1 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>{isGenerating ? 'Drafting...' : 'AI Enhance'}</span>
                            </button>
                            <div className="space-x-2">
                                <button onClick={() => setIsDrafting(false)} className="text-slate-400 hover:text-slate-600 text-sm px-3">Cancel</button>
                                <button onClick={handlePost} className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-400">Post Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`p-1.5 rounded-lg ${post.type === 'SALE' ? 'bg-emerald-50 text-emerald-600' : post.type === 'EVENT' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {post.type === 'SALE' ? <Tag className="w-4 h-4" /> : post.type === 'EVENT' ? <Calendar className="w-4 h-4" /> : <Megaphone className="w-4 h-4" />}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{post.type}</span>
                                </div>
                                <span className="text-xs text-slate-400">{post.author}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">{post.title}</h3>
                            {post.price && <p className="text-emerald-600 font-medium text-sm mb-2">{post.price}</p>}
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.content}</p>
                            <div className="flex items-center space-x-4 border-t border-slate-50 pt-3">
                                <button className="flex items-center space-x-1 text-slate-400 hover:text-rose-500 transition-colors text-xs group">
                                    <Heart className="w-4 h-4 group-hover:fill-rose-500" />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="text-xs text-slate-400 hover:text-sky-500 transition-colors">Reply</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};