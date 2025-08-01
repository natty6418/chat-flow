import React from 'react';
import { MessageCircle, LogOut, User, Settings, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function ChatHeader() {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/20">
                <MessageCircle className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  ChatFlow
                </h1>
                <p className="text-blue-100 text-xs md:text-sm font-medium hidden md:block">Real-time collaborative messaging</p>
              </div>
              {/* Mobile title - smaller and simpler */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-white">ChatFlow</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* User info - simplified on mobile */}
            <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
              <div className="w-8 h-8 bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-white">
                  {user?.preferredUsername || user?.username}
                </div>
                <div className="text-blue-100 text-xs">Online</div>
              </div>
            </div>

            {/* Mobile user avatar only */}
            <div className="sm:hidden w-8 h-8 bg-gradient-to-r from-white/20 to-white/30 rounded-full flex items-center justify-center border border-white/20">
              <User className="w-4 h-4 text-white" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Hide notification and settings on mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
              {/* Sign out button - always visible but smaller text on mobile */}
              <Button
                variant="secondary"
                size="sm"
                onClick={signOut}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline ml-1 md:ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}