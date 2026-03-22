import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash } from 'tabler-icons-react';
import { TitleLink } from 'types';
import { Menu } from '@headlessui/react';

interface ManageHeaderTitleProps {
  titleLinks: TitleLink[];
  title: string;
}

function ManageHeaderTitle({
  titleLinks,
  title,
}: ManageHeaderTitleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Menu as="div" className="relative">
        <Menu.Button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Hash size={18} />
        </Menu.Button>
        <Menu.Items className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {titleLinks.map(titleLink => (
              <Menu.Item key={titleLink.label}>
                {({ active }) => (
                  <Link
                    to={titleLink.link}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    {titleLink.label}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

export default React.memo(ManageHeaderTitle);
