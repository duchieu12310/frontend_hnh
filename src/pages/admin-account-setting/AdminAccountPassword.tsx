import React from 'react';
import { Button, Card, Group, PasswordInput, Stack, Title } from '@mantine/core';
import { z } from 'zod';
import MessageUtils from 'utils/MessageUtils';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import { ClientPasswordSettingUserRequest } from 'types';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import MiscUtils from 'utils/MiscUtils';
import { ArrowLeft } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import ManagerPath from 'constants/ManagerPath';

const formSchema = z.object({
  oldPassword: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(1, MessageUtils.min('Mật khẩu', 1)),
  newPassword: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(1, MessageUtils.min('Mật khẩu', 1)),
  newPasswordAgain: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(1, MessageUtils.min('Mật khẩu', 1)),
});

function AdminAccountPassword() {
  const initialFormValues = {
    oldPassword: '',
    newPassword: '',
    newPasswordAgain: '',
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema),
  });

  const updatePasswordSettingApi = useMutation<never, ErrorMessage, ClientPasswordSettingUserRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_USER_PASSWORD_SETTING, requestBody),
    {
      onSuccess: () => {
        NotifyUtils.simpleSuccess('Cập nhật thành công');
        form.reset();
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (formValues.newPassword !== formValues.newPasswordAgain) {
      form.setFieldError('newPasswordAgain', 'Mật khẩu không trùng khớp');
    } else {
      updatePasswordSettingApi.mutate({
        oldPassword: formValues.oldPassword,
        newPassword: formValues.newPassword,
      });
    }
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
        <Title order={3}>Đổi mật khẩu</Title>
      </Group>
      <Card radius="md" shadow="xs" p="lg" sx={{ maxWidth: 600 }}>
        <form onSubmit={handleFormSubmit}>
          <Stack>
            <PasswordInput
              required
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại"
              {...form.getInputProps('oldPassword')}
            />
            <PasswordInput
              required
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              {...form.getInputProps('newPassword')}
            />
            <PasswordInput
              required
              label="Nhập lại mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              {...form.getInputProps('newPasswordAgain')}
            />
            <Button
              radius="md"
              type="submit"
              loading={updatePasswordSettingApi.isLoading}
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

export default AdminAccountPassword;
