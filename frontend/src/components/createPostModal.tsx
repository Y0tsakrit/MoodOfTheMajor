import React, { useState } from 'react';
import { X, Smile } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; content: string; mood: string; isAnonymous: boolean }) => void;
}

export default function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Happy');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const moods = [
    { label: 'Happy', color: 'bg-zinc-900 text-zinc-100 border-zinc-700' },
    { label: 'Sad', color: 'bg-zinc-900 text-zinc-100 border-zinc-700' },
    { label: 'Stressed', color: 'bg-zinc-900 text-zinc-100 border-zinc-700' },
    { label: 'Chill', color: 'bg-zinc-900 text-zinc-100 border-zinc-700' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, mood, isAnonymous });
    setTitle('');
    setContent('');
    setMood('Happy');
    setIsAnonymous(false);
    onClose();
  };

  return (
    <div className="z-100 fixed inset-0 flex justify-center items-center p-4">
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative flex flex-col gap-4 bg-[#11121a] shadow-2xl p-6 border border-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden text-white transition-all transform">
        
        <div className="flex justify-between items-center pb-3 border-zinc-900 border-b">
          <div className="flex items-center gap-2">
            <Smile className="text-zinc-400" size={22} />
            <h2 className="font-bold text-zinc-100 text-xl">Share Your Mood</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-zinc-900 p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-[#0d0e15] px-4 py-3 border border-zinc-900 focus:border-zinc-700 rounded-xl focus:outline-none w-full text-white text-sm transition-colors placeholder-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Express yourself here..."
              className="bg-[#0d0e15] px-4 py-3 border border-zinc-900 focus:border-zinc-700 rounded-xl focus:outline-none w-full text-white text-sm transition-colors resize-none placeholder-zinc-650"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-zinc-500 text-xs uppercase tracking-wider">Select Current Mood</label>
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
              {moods.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setMood(item.label)}
                  className={`flex items-center justify-center rounded-xl p-2.5 text-sm font-medium border transition-all duration-200 ${
                    mood === item.label
                      ? `${item.color} ring-1 ring-zinc-500`
                      : 'border-zinc-900 bg-[#0d0e15] text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-4 border-zinc-900 border-t">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-300 text-sm">Post Anonymously</span>
              <span className="text-zinc-600 text-xs">Hide your name and major from the public timeline</span>
            </div>
            <label className="inline-flex relative items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="peer after:top-0.5 after:absolute bg-zinc-900 after:bg-zinc-700 peer-checked:after:bg-zinc-950 peer-checked:bg-zinc-400 peer-checked:after:border-zinc-950 rounded-full after:rounded-full w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full after:start-[2px]"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-zinc-900 px-4 py-2.5 border border-zinc-900 rounded-xl font-semibold text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-zinc-200 hover:bg-zinc-100 shadow-xl px-5 py-2.5 rounded-xl font-semibold text-zinc-950 text-sm transition-colors"
            >
              Publish Post
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}