import React from 'react';
import { AppShell } from '@mantine/core';
import { DefaultHeader } from 'components/DefaultHeader/DefaultHeader';
import { DefaultNavbar } from 'components/DefaultNavbar/DefaultNavbar';
import { Outlet } from 'react-router-dom';
import useTitle from 'hooks/use-title';
import useAdminAuthStore from 'stores/use-admin-auth-store';
import useAppStore from 'stores/use-app-store';
import AdminSignin from 'pages/admin-signin';

function Admin() {
  useTitle();

  const { user } = useAdminAuthStore();
  const { collapsed } = useAppStore();

  if (!user) {
    return <AdminSignin/>;
  }

  return (
    <AppShell
      fixed
      header={<DefaultHeader/>}
      navbar={<DefaultNavbar/>}
      navbarOffsetBreakpoint="sm"
      styles={theme => ({
        main: {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <div className={`pt-14 min-h-screen transition-all duration-300 ${
        collapsed 
          ? 'pl-0 md:pl-16' 
          : 'pl-0 md:pl-64'
      }`}>
        <div className="p-6">
          <Outlet/>
        </div>
      </div>
    </AppShell>
  );
}

export default Admin;
