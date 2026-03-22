import React from 'react';

interface FilterPanelHeaderProps {
  children: React.ReactNode;
}

function FilterPanelHeader({
  children,
}: FilterPanelHeaderProps) {

  return (
    <div className="flex items-center justify-between p-3">
      {children}
    </div>
  );
}

export default FilterPanelHeader;
