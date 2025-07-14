import React from 'react';
import { MessageCircle, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function ChatHeader() {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ChatFlow</h1>
              <p className="text-blue-100 text-sm">Real-time collaborative messaging</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-blue-200" />
            <span className="text-blue-100">{user?.username}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={signOut}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}