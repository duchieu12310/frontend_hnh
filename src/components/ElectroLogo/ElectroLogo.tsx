import React from 'react';

interface ElectroLogoProps {
  width?: number;
  className?: string;
}

function ElectroLogo({ width = 120, className = "" }: ElectroLogoProps) {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="NHIÊN BOOKSTORE" 
        style={{ height: '100%', width: 'auto' }}
        className="object-contain" 
      />
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-none uppercase">
          NHIÊN
        </span>
        <span className="text-[10px] font-medium tracking-[0.2em] text-blue-600 dark:text-blue-400 leading-none mt-1 uppercase">
          BOOKSTORE
        </span>
      </div>
    </div>
  );
}

export default ElectroLogo;
