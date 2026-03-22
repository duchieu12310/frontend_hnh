import React from 'react';

function FloatingCodeFrame({ object }: { object: object }) {
  return (
    <div className="fixed top-12 right-0 w-[450px] h-[600px] overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg">
      <pre className="p-4 text-xs font-mono text-gray-900 dark:text-gray-100">
        <code>{JSON.stringify(object, null, 2)}</code>
      </pre>
    </div>
  );
}

export default FloatingCodeFrame;
