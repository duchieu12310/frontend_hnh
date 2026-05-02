import React, { useEffect, useState } from 'react';
import useTitle from 'hooks/use-title';
import { Button, Card, Container, Grid, Select, Stack, TextInput, Title } from '@mantine/core';
import { ClientUserNavbar } from 'components';
import { ClientPersonalSettingUserRequest, SelectOption } from 'types';
import { z } from 'zod';
import MessageUtils from 'utils/MessageUtils';
import useAuthStore from 'stores/use-auth-store';
import { useForm, zodResolver } from '@mantine/form';
import useGetAllApi from 'hooks/use-get-all-api';
import { ProvinceResponse } from 'models/Province';
import ProvinceConfigs from 'pages/province/ProvinceConfigs';
import { DistrictResponse } from 'models/District';
import DistrictConfigs from 'pages/district/DistrictConfigs';
import MiscUtils from 'utils/MiscUtils';
import { useMutation } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { UserResponse } from 'models/User';
import { WardResponse } from 'models/Ward';
import WardConfigs from 'pages/ward/WardConfigs';
import useSelectAddress from 'hooks/use-select-address';



const formSchema = z.object({
  username: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' })
    .min(2, MessageUtils.min('Tên tài khoản', 2)),
  fullname: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
  gender: z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
  'address.line': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }),
  'address.provinceId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }).nullable(),
  'address.districtId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }).nullable(),
  'address.wardId': z.string({ invalid_type_error: 'Vui lòng không bỏ trống' }).nullable(),
});

const genderSelectList: SelectOption[] = [
  { value: 'M', label: 'Nam' },
  { value: 'F', label: 'Nữ' },
];

function ClientSettingPersonal() {
  useTitle();
  const { user, updateUser } = useAuthStore();

  const form = useForm({
    initialValues: {
      username: user?.username || '',
      fullname: user?.fullname || '',
      gender: user?.gender || 'M',
      'address.line': user?.address?.line || '',
      'address.provinceId': user?.address?.province?.id ? String(user.address.province.id) : null,
      'address.districtId': user?.address?.district?.id ? String(user.address.district.id) : null,
      'address.wardId': user?.address?.ward?.id ? String(user.address.ward.id) : null,
    },
    validate: zodResolver(formSchema),
  });

  useSelectAddress(form, 'address.provinceId', 'address.districtId', 'address.wardId');


  const [provinceSelectList, setProvinceSelectList] = useState<SelectOption[]>([]);
  const [districtSelectList, setDistrictSelectList] = useState<SelectOption[]>([]);
  const [wardSelectList, setWardSelectList] = useState<SelectOption[]>([]);

  useGetAllApi<ProvinceResponse>(ProvinceConfigs.resourceUrl, ProvinceConfigs.resourceKey,
    { all: 1 },
    (provinceListResponse) => {
      setProvinceSelectList(provinceListResponse.content.map(p => ({ value: String(p.id), label: p.name })));
    }
  );

  useGetAllApi<DistrictResponse>(DistrictConfigs.resourceUrl, DistrictConfigs.resourceKey,
    { all: 1, filter: `province.id==${form.values['address.provinceId'] || 0}` },
    (districtListResponse) => {
      setDistrictSelectList(districtListResponse.content.map(d => ({ value: String(d.id), label: d.name })));
    }
  );

  useGetAllApi<WardResponse>(WardConfigs.resourceUrl, WardConfigs.resourceKey,
    { all: 1, filter: `district.id==${form.values['address.districtId'] || 0}` },
    (wardListResponse) => {
      setWardSelectList(wardListResponse.content.map(w => ({ value: String(w.id), label: w.name })));
    }
  );

  const updatePersonalSettingApi = useMutation<UserResponse, ErrorMessage, ClientPersonalSettingUserRequest>(
    (requestBody) => FetchUtils.postWithToken(ResourceURL.CLIENT_USER_PERSONAL_SETTING, requestBody),
    {
      onSuccess: (userResponse) => {
        updateUser(userResponse);
        NotifyUtils.simpleSuccess('Cập nhật thành công');
      },
      onError: () => NotifyUtils.simpleFailed('Cập nhật không thành công'),
    }
  );

  const handleFormSubmit = form.onSubmit((formValues) => {
    const requestBody: ClientPersonalSettingUserRequest = {
      username: formValues.username,
      fullname: formValues.fullname,
      gender: formValues.gender,
      address: {
        line: formValues['address.line'],
        provinceId: Number(formValues['address.provinceId']),
        districtId: Number(formValues['address.districtId']),
        wardId: Number(formValues['address.wardId']),
      },
    };
    updatePersonalSettingApi.mutate(requestBody);
  });

  return (
    <main>
      <Container size="xl">
        <Grid gutter="lg">
          <Grid.Col md={3}><ClientUserNavbar/></Grid.Col>
          <Grid.Col md={9}>
            <Card radius="md" shadow="sm" p="lg">
              <Stack>
                <Title order={2}>Cập nhật thông tin cá nhân</Title>
                <Grid>
                  <Grid.Col lg={6}>
                    <form onSubmit={handleFormSubmit}>
                      <Stack>
                        <TextInput label="Tên tài khoản" {...form.getInputProps('username')} disabled />
                        <TextInput required label="Họ và tên" {...form.getInputProps('fullname')} />
                        <Select required label="Giới tính" data={genderSelectList} {...form.getInputProps('gender')} />
                        <Select required label="Tỉnh thành" data={provinceSelectList} {...form.getInputProps('address.provinceId')} />
                        <Select required label="Quận huyện" data={districtSelectList} disabled={!form.values['address.provinceId']} {...form.getInputProps('address.districtId')} />
                        <Select required label="Phường xã" data={wardSelectList} disabled={!form.values['address.districtId']} {...form.getInputProps('address.wardId')} />
                        <TextInput required label="Địa chỉ" {...form.getInputProps('address.line')} />

                        <Button radius="md" type="submit" loading={updatePersonalSettingApi.isLoading}>Cập nhật</Button>
                      </Stack>
                    </form>
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </main>
  );
}

export default ClientSettingPersonal;
