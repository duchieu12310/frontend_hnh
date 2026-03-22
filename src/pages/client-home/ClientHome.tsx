import React from 'react';
import ClientHomeBanner from 'pages/client-home/ClientHomeBanner';
import ClientHomeFeaturedCategories from 'pages/client-home/ClientHomeFeaturedCategories';
import ClientHomeLatestProducts from 'pages/client-home/ClientHomeLatestProducts';
import ClientHomeSlowSellingProducts from 'pages/client-home/ClientHomeSlowSellingProducts';
import useTitle from 'hooks/use-title';

function ClientHome() {
  useTitle();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col gap-16">
          <ClientHomeBanner/>
          <ClientHomeFeaturedCategories/>
          <ClientHomeLatestProducts/>
          <ClientHomeSlowSellingProducts/>
        </div>
      </div>
    </main>
  );
}

export default ClientHome;
