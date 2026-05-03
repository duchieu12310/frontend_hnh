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
import { ClientPhoneSettingUserRequest } from 'types';
import MiscUtils from 'utils/MiscUtils';
import { ArrowLeft } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import ManagerPath from 'constants/ManagerPath';

const formSchema = z.object({
  phone: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .regex(/(((\+|)84)|0)[1-9][0-9]{8}\b/, { message: 'Nhập số điện thoại đúng định dạng' }),
});

function AdminAccountPhone() {
  const { user, updateUser } = useAdminAuthStore();

  const initialFormValues = {
    phone: user?.phone || '',
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema),
  });

  const updatePhoneSettingApi = useMutation<UserResponse, ErrorMessage, ClientPhoneSettingUserRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_USER_PHONE_SETTING, requestBody),
    {
      onSuccess: (userResponse) => {
        updateUser(userResponse);
        NotifyUtils.simpleSuccess('Cập nhật thành công');
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    updatePhoneSettingApi.mutate({ phone: formValues.phone });
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
        <Title order={3}>Cập nhật số điện thoại</Title>
      </Group>
      <Card radius="md" shadow="xs" p="lg" sx={{ maxWidth: 600 }}>
        <form onSubmit={handleFormSubmit}>
          <Stack>
            <TextInput
              required
              label="Số điện thoại"
              placeholder="Nhập số điện thoại của bạn"
              {...form.getInputProps('phone')}
            />
            <Button
              radius="md"
              type="submit"
              loading={updatePhoneSettingApi.isLoading}
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

export default AdminAccountPhone;
