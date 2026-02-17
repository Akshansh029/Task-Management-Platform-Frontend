'use client';

import React from 'react';
import Link from 'next/link';
import ActiveUserSelector from './ActiveUserSelector';
import { CheckSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <CheckSquare className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900 tracking-tight">
          TaskManager
        </span>
      </Link>
      
      <div className="flex items-center">
        <ActiveUserSelector />
      </div>
    </nav>
  );
};

export default Navbar;
