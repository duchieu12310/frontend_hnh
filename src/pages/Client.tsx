import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ActionIcon, Affix, Anchor, Button, Card, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import { ClientFooter, ClientHeader, LoadingMiddleware } from 'components';
import { Messages, MoonStars, Sun } from 'tabler-icons-react';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { useIsFetching } from 'react-query';
import useAuthStore from 'stores/use-auth-store';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import { UserResponse } from 'models/User';

function Client() {
  const isLoading = useIsFetching();

  const { user, jwtToken, updateUser, resetAuthState } = useAuthStore();

  // Validate token khi app khởi động nếu có token
  // Nếu token không hợp lệ hoặc hết hạn, clear state để hiển thị menu chưa đăng nhập
  useQuery<UserResponse, ErrorMessage>(
    ['client-api', 'users', 'info', 'validate'],
    () => FetchUtils.getWithToken(ResourceURL.CLIENT_USER_INFO),
    {
      enabled: !!jwtToken, // Chỉ chạy khi có token
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        // Nếu validate thành công, cập nhật user (đảm bảo user info là mới nhất)
        updateUser(data);
      },
      onError: () => {
        // Nếu token không hợp lệ hoặc hết hạn, clear state
        resetAuthState();
      },
    }
  );

  // Nếu có user nhưng không có token, clear state
  useEffect(() => {
    if (user && !jwtToken) {
      resetAuthState();
    }
  }, [user, jwtToken, resetAuthState]);

  return (
    <>
      <LoadingMiddleware isLoading={!!isLoading}>
        <ClientHeader/>
        <Outlet/>
        <ClientFooter/>
      </LoadingMiddleware>
      {user && <ChatButton/>}
      <Shortcut/>
    </>
  );
}

function ChatButton() {
  return (
    <Affix position={{ bottom: 100, right: 20 }}>
      <Card shadow="sm" p="xs" radius="xl">
        <Tooltip
          label="Yêu cầu tư vấn mua hàng"
          position="left"
          placement="center"
          withArrow
        >
          <ActionIcon
            component={Link}
            to="/user/chat"
            color="teal"
            size="xl"
            radius="xl"
            variant="light"
          >
            <Messages/>
          </ActionIcon>
        </Tooltip>
      </Card>
    </Affix>
  );
}

// Only for test
function Shortcut() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const [opened, handlers] = useDisclosure(false);

  useHotkeys([
    ['alt+Q', () => handlers.toggle()],
  ]);

  const { resetAuthState } = useAuthStore();

  return (
    <Affix position={{ bottom: 20, right: 100 }} sx={{ display: opened ? 'block' : 'none' }}>
      <Card shadow="sm" p="sm">
        <Group>
          <Anchor component={Link} to="/">Client</Anchor>
          <Anchor component={Link} to="/admin">Admin</Anchor>
          <Button color="teal" variant="light" compact onClick={resetAuthState}>
            ResetAuthState
          </Button>
          <ActionIcon
            size="sm"
            variant="outline"
            color={dark ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title="Thay đổi chế độ màu"
          >
            {dark ? <Sun size={14}/> : <MoonStars size={14}/>}
          </ActionIcon>
        </Group>
      </Card>
    </Affix>
  );
}

export default Client;
