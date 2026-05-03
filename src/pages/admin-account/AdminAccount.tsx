import React from 'react';
import { Avatar, Badge, Button, Divider, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Home, Lock, Mail, Mars, Phone, Venus } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import useAdminAuthStore from 'stores/use-admin-auth-store';
import ManagerPath from 'constants/ManagerPath';

function AdminAccount() {
  const { user } = useAdminAuthStore();

  return (
    <Stack>
      <Title order={3}>Thông tin tài khoản</Title>

      <Paper shadow="xs" p="xl" sx={{ maxWidth: 600 }}>
        <Stack spacing="lg">
          <Text size="lg" color="dimmed" weight={500}>
            Thông tin cá nhân
          </Text>

          <Group position="apart">
            <Group>
              <Avatar color="cyan" size="lg" radius="md">{user?.fullname.charAt(0)}</Avatar>
              <Stack spacing={0}>
                <Text weight={500}>{user?.fullname}</Text>
                <Text color="dimmed">@{user?.username}</Text>
              </Stack>
            </Group>
            <Button
              component={Link}
              to={ManagerPath.ACCOUNT_PERSONAL}
              variant="outline"
              radius="md"
            >
              Cập nhật
            </Button>
          </Group>

          <Divider my={3.5} variant="dotted"/>

          <Group spacing="sm">
            <ThemeIcon radius="xl" size="lg" variant="light">
              {user?.gender === 'M'
                ? <Mars size={20} strokeWidth={1.5}/>
                : <Venus size={20} strokeWidth={1.5}/>}
            </ThemeIcon>
            <Stack spacing={0}>
              <Text weight={500}>Giới tính</Text>
              {user?.gender === 'M' ? 'Nam' : 'Nữ'}
            </Stack>
          </Group>

          <Group spacing="sm" sx={{ flexWrap: 'nowrap' }}>
            <ThemeIcon radius="xl" size="lg" variant="light">
              <Home size={20} strokeWidth={1.5}/>
            </ThemeIcon>
            <Stack spacing={0}>
              <Text weight={500}>Địa chỉ</Text>
              <Text>
                {[user?.address.line, user?.address.ward?.name, user?.address.district?.name, user?.address.province?.name]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </Stack>
          </Group>

          <Text size="lg" color="dimmed" weight={500}>
            Số điện thoại và Email
          </Text>

          <Group position="apart">
            <Group spacing="sm">
              <ThemeIcon radius="xl" size="lg" variant="light">
                <Phone size={20} strokeWidth={1.5}/>
              </ThemeIcon>
              <Stack spacing={0}>
                <Text weight={500}>Số điện thoại</Text>
                <Text>{user?.phone}</Text>
              </Stack>
            </Group>
            <Button
              component={Link}
              to={ManagerPath.ACCOUNT_PHONE}
              variant="outline"
              radius="md"
            >
              Cập nhật
            </Button>
          </Group>

          <Group position="apart">
            <Group spacing="sm">
              <ThemeIcon radius="xl" size="lg" variant="light">
                <Mail size={20} strokeWidth={1.5}/>
              </ThemeIcon>
              <Stack spacing={0}>
                <Text weight={500}>Email</Text>
                <Text>{user?.email}</Text>
              </Stack>
            </Group>
            <Button
              component={Link}
              to={ManagerPath.ACCOUNT_EMAIL}
              variant="outline"
              radius="md"
            >
              Cập nhật
            </Button>
          </Group>

          <Text size="lg" color="dimmed" weight={500}>
            Bảo mật
          </Text>

          <Group position="apart">
            <Group spacing="sm">
              <ThemeIcon radius="xl" size="lg" variant="light">
                <Lock size={20} strokeWidth={1.5}/>
              </ThemeIcon>
              <Text weight={500}>Đổi mật khẩu</Text>
            </Group>
            <Button
              component={Link}
              to={ManagerPath.ACCOUNT_PASSWORD}
              variant="outline"
              radius="md"
            >
              Cập nhật
            </Button>
          </Group>

          <Text size="lg" color="dimmed" weight={500}>
            Quyền người dùng
          </Text>

          <Group spacing="xs">
            {user?.roles.map(role => <Badge key={role.id} radius="sm">{role.name}</Badge>)}
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default AdminAccount;
