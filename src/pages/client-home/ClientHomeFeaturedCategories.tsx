import React from 'react';
import { List } from 'tabler-icons-react';
import PageConfigs from 'pages/PageConfigs';
import { Link } from 'react-router-dom';
import MockUtils from 'utils/MockUtils';

function ClientHomeFeaturedCategories() {

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Danh mục nổi bật
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Khám phá các sản phẩm đặc sắc của chúng tôi</p>
        </div>
        <Link
          to="/all-categories"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium"
        >
          <List size={18} />
          <span>Xem tất cả</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {MockUtils.featuredCategories.map((category, index) => {
          const CategoryIcon = PageConfigs.categorySlugIconMap[category.categorySlug];
          const gradientColors = [
            'from-emerald-500 to-teal-600',
            'from-blue-500 to-cyan-600',
            'from-purple-500 to-pink-600',
            'from-orange-500 to-red-600',
            'from-amber-500 to-yellow-600',
            'from-indigo-500 to-purple-600',
          ];
          const bgGradient = gradientColors[index % gradientColors.length];

          return (
            <Link
              key={category.categorySlug}
              to={'/category/' + category.categorySlug}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className={`p-4 bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <CategoryIcon size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                  {category.categoryName}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ClientHomeFeaturedCategories;
