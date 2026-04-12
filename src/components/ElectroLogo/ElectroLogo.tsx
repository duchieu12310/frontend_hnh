
import React from 'react';

interface ElectroLogoProps {
  width?: number;
  className?: string;
}

function ElectroLogo({ width = 120, className = "" }: ElectroLogoProps) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center transform rotate-3 transition-transform group-hover:rotate-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none uppercase">
          HIẾU
        </span>
        <span className="text-[10px] font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 leading-none mt-1 uppercase">
          BOOKSTORE
        </span>
      </div>
    </div>
  );
}

export default ElectroLogo;
