import React, { useState, useEffect } from 'react'
import { Home, Search, Shield, Smile, LogOut, Settings } from 'lucide-react';

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
  onShareMoodClick: () => void; // Added callback function prop to send out click signals
}

function NavBar({ data, onShareMoodClick }: NavBarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const updateCollapsed = () => setIsCollapsed(window.innerWidth < 768);
      updateCollapsed();
      window.addEventListener('resize', updateCollapsed);
      return () => window.removeEventListener('resize', updateCollapsed);
    }, []);

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
          {/* Linked onClick handler directly to the custom callback execution signal */}
          <button 
            onClick={onShareMoodClick}
            className={`bg-zinc-200 hover:bg-zinc-100 text-zinc-950 font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isCollapsed ? 'w-12 h-12 p-0 self-center rounded-full' : 'w-full p-3 rounded-full'}`}
          >
            <Smile size={20} className="shrink-0" />
            {!isCollapsed && <span>Share Mood</span>}
          </button>

          <div className={`flex items-center justify-between pt-4 border-t border-zinc-900 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex justify-center items-center bg-zinc-800 rounded-full w-10 h-10 font-bold text-zinc-300 shrink-0">
                {user.initial}
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col items-start min-w-0">
                  <span className="w-28 font-semibold text-white text-sm text-left truncate">{user.name}</span>
                  <span className="w-28 text-zinc-500 text-xs text-left truncate">{user.major}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button className="text-gray-400 hover:text-white transition-colors shrink-0">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
}

export default NavBar;