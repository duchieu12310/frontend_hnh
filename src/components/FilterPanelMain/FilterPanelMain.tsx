import React from 'react';

interface FilterPanelMainProps {
  children: React.ReactNode;
}

function FilterPanelMain({
  children,
}: FilterPanelMainProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
      {children}
    </div>
  );
}

export default FilterPanelMain;
