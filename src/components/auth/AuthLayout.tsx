import React from 'react';
import { MessageCircle, Zap, Shield, Users, Globe } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo and Branding */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-xl">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                ChatFlow
              </h1>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-gray-600 text-lg">{subtitle}</p>
            </div>

            {/* Content */}
            {children}

            {/* Features Grid */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-bold text-gray-800 mb-4 text-center">Why Choose ChatFlow?</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Real-time messaging</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Team workspaces</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Secure authentication</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Cross-platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            © 2024 ChatFlow. Built with ❤️ for better collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}