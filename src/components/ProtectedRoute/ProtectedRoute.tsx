import React from 'react';
import useAuthStore from 'stores/use-auth-store';
import { Link } from 'react-router-dom';

function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <main>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col gap-6 text-center">
            <p className="text-[120px] font-bold text-gray-300 dark:text-gray-700">
              401
            </p>
            <h1 className="text-2xl font-semibold">
              Vui lòng <Link to="/signin" className="text-blue-600 hover:underline">đăng nhập</Link> để truy cập
            </h1>
            <div className="flex justify-center">
              <Link 
                to="/" 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                Trở về Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return children;
}

export default ProtectedRoute;
