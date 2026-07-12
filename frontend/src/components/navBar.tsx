import React, { useState } from 'react'
import { Home, Search, Shield, Smile, LogOut, ChevronLeft, ChevronRight, Settings } from 'lucide-react';


function NavBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = {
    name: 'Anon Student',
    major: 'Computer Science (Science)',
  };

  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Explore', active: false },
    { icon: Shield, label: 'Moderation', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className={`h-screen bg-[#0d0e15] text-white flex flex-col justify-between p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-slate-700 rounded-full w-10 h-10 text-xl">
              😺
            </div>
            {!isCollapsed && <span className="font-bold text-2xl">Mood of the Major</span>}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-800 p-1 rounded text-gray-400"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                  item.active 
                    ? 'bg-blue-600 text-white font-medium shadow-md shadow-purple-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-blue-400'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={22} className={item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <button className={`bg-blue-600 hover:bg-blue-500 text-white font-medium p-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${isCollapsed ? 'w-12 h-12 p-0 self-center' : 'w-full'}`}>
          <Smile size={20} />
          {!isCollapsed && <span>Share Mood</span>}
        </button>

        <div className={`flex items-center justify-between pt-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            {!isCollapsed && (
              <div className="flex flex-col items-start min-w-0">
                <span className="w-28 font-semibold text-sm text-left truncate">{user.name}</span>
                <span className="w-28 text-gray-500 text-xs text-left truncate">{user.major}</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="text-gray-400 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;