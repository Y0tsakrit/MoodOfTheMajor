import React, { useState, useEffect } from 'react';
import { Home, Search, Shield, Smile, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Imported the router navigation controller hook
import CreatePostModal from './createPostModal'; 
import { createPost } from '../page/home/action'; 
import { useAuth } from "../components/authContext";
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NavBarProps {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    year: string;
    isAdmin: boolean;
    department: {
      id: string;
      faculty: string;
      major: string;
      CreatedAt: string;
      UpdatedAt: string;
    };
  } | null;
  onPostStatus: (status: { show: boolean; message: string; type: 'success' | 'error' }) => void;
}

function NavBar({ data, onPostStatus }: NavBarProps) {
    const { accessToken, setAccessToken } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const updateCollapsed = () => setIsCollapsed(window.innerWidth < 768);
      updateCollapsed();
      window.addEventListener('resize', updateCollapsed);
      return () => window.removeEventListener('resize', updateCollapsed);
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      queryClient.clear();
      navigate('/login');
    };

    const mutation = useMutation({
      mutationFn: (formData: { title: string; content: string; mood: string; isAnonymous: boolean }) => 
        createPost(formData, accessToken!),
      onSuccess: () => {
        onPostStatus({
          show: true,
          message: 'Post published successfully!',
          type: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
      onError: () => {
        onPostStatus({
          show: true,
          message: 'Failed to create post.',
          type: 'error',
        });
      }
    });

    const user = {
      name: data ? `${data.firstName} ${data.lastName}` : 'Failure',
      major: data?.department?.major 
        ? `${data.department.major.toLocaleUpperCase()} - ${data.department.faculty.slice(0, 3).toUpperCase()}` 
        : 'Failure',
      initial: data?.firstName ? data.firstName.charAt(0).toUpperCase() : 'F'
    };

    const navItems = [
      { icon: Home, label: 'Home', active: true },
      { icon: Search, label: 'Explore', active: false },
      ...(data?.isAdmin ? [{ icon: Shield, label: 'Moderation', active: false }] : []),
      { icon: Settings, label: 'Settings', active: false },
    ];

    return (
      <div className={`sticky top-0 h-screen bg-[#0d0e15] border-r border-zinc-900 text-white flex flex-col justify-between p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full'}`}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-zinc-800 rounded-full w-10 h-10 font-bold text-zinc-400 shrink-0">
                {user.initial}
              </div>
              {!isCollapsed && <span className="font-bold text-2xl truncate tracking-tight">MoodBoard</span>}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                    item.active 
                      ? 'bg-zinc-800 text-white font-medium shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-zinc-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon size={22} className="shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`bg-zinc-200 hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isCollapsed ? 'w-12 h-12 p-0 self-center rounded-full' : 'w-full p-3 rounded-full'}`}
          >
            <Smile size={20} className="shrink-0" />
            {!isCollapsed && <span>Share Mood</span>}
          </button>

          <div className={`flex items-center justify-between pt-4 border-t border-zinc-900 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={isCollapsed ? handleLogout : undefined}
                title={isCollapsed ? "Log Out" : undefined}
                className={`flex justify-center items-center bg-zinc-800 rounded-full w-10 h-10 font-bold text-zinc-300 shrink-0 ${isCollapsed ? 'hover:bg-red-950/30 hover:text-red-400 border border-transparent hover:border-red-900/50 transition-colors' : ''}`}
              >
                {isCollapsed ? <LogOut size={18} /> : user.initial}
              </button>
              
              {!isCollapsed && (
                <div className="flex flex-col items-start min-w-0">
                  <span className="w-28 font-semibold text-white text-sm text-left truncate">{user.name}</span>
                  <span className="w-28 text-zinc-500 text-xs text-left truncate">{user.major}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button 
                onClick={handleLogout}
                className="hover:bg-zinc-900 p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition-colors shrink-0"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>

        <CreatePostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={(formData) => mutation.mutate(formData)} 
        />
      </div>
    );
}

export default NavBar;