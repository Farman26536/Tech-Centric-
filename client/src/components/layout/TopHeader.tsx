import React from 'react';
import Avatar from '../common/Avatar';
import { Search, Bell } from 'lucide-react';

export const TopHeader: React.FC<{ title?: string }> = ({ title = '' }) => {
  return (
    <header className="bg-white border-b px-6 py-3">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-gray-900">{title}</div>
          <div className="hidden sm:block text-sm text-gray-500">{title ? '' : 'Overview'}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button aria-label="Search" className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="relative">
            <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">3</span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar name="Admin User" />
            <div className="hidden sm:block text-sm">
              <div className="font-medium">Admin User</div>
              <div className="text-xs text-gray-500">ADMIN</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
