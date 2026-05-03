import React from 'react';
import { Button, Card, Group, Stack, TextInput, Title } from '@mantine/core';
import { z } from 'zod';
import useAdminAuthStore from 'stores/use-admin-auth-store';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { UserResponse } from 'models/User';
import { ClientEmailSettingUserRequest } from 'types';
import MiscUtils from 'utils/MiscUtils';
import { ArrowLeft } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import ManagerPath from 'constants/ManagerPath';

const formSchema = z.object({
  email: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .email({ message: 'Nhập email đúng định dạng' }),
});

function AdminAccountEmail() {
  const { user, updateUser } = useAdminAuthStore();

  const initialFormValues = {
    email: user?.email || '',
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema),
  });

  const updateEmailSettingApi = useMutation<UserResponse, ErrorMessage, ClientEmailSettingUserRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_USER_EMAIL_SETTING, requestBody),
    {
      onSuccess: (userResponse) => {
        updateUser(userResponse);
        NotifyUtils.simpleSuccess('Cập nhật thành công');
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    updateEmailSettingApi.mutate({ email: formValues.email });
  });

  return (
    <Stack>
      <Group>
        <Button 
          variant="subtle" 
          leftIcon={<ArrowLeft size={16} />} 
          component={Link} 
          to={ManagerPath.ACCOUNT}
          color="gray"
        >
          Quay lại
        </Button>
        <Title order={3}>Cập nhật email</Title>
      </Group>
      <Card radius="md" shadow="xs" p="lg" sx={{ maxWidth: 600 }}>
        <form onSubmit={handleFormSubmit}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="Nhập email của bạn"
              {...form.getInputProps('email')}
            />
            <Button
              radius="md"
              type="submit"
              loading={updateEmailSettingApi.isLoading}
              disabled={MiscUtils.isEquals(initialFormValues, form.values)}
            >
              Cập nhật
            </Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}

export default AdminAccountEmail;
