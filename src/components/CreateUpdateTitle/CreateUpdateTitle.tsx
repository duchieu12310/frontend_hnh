import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'tabler-icons-react';

interface CreateUpdateTitleProps {
  managerPath: string;
  title: string;
}

function CreateUpdateTitle({
  managerPath,
  title,
}: CreateUpdateTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <Link
        to={managerPath}
        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <ChevronLeft size={20}/>
      </Link>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

export default React.memo(CreateUpdateTitle);
