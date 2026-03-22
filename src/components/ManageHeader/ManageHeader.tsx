import React from 'react';

interface ManageHeaderProps {
  children: React.ReactNode;
}

function ManageHeader({
  children,
}: ManageHeaderProps) {

  return (
    <div className="flex items-center justify-between">
      {children}
    </div>
  );
}

export default ManageHeader;
