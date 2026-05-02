import React, { useEffect, useState } from 'react';
import { Badge, Button, Group, Paper, Stack, Table, Text, Title } from '@mantine/core';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { WaybillResponse } from 'models/Waybill';
import { Truck } from 'tabler-icons-react';
import DateUtils from 'utils/DateUtils';
import MiscUtils from 'utils/MiscUtils';

import useAuthStore from 'stores/use-auth-store';

function ShipperWaybillManage() {
  const { user } = useAuthStore();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  // Debug dữ liệu để kiểm tra tại sao không nhận tọa độ
  useEffect(() => {
    console.log('Shipper Info:', {
      browserCoords: coords,
      profileAddress: user?.address,
      allAddresses: user?.addresses
    });
  }, [coords, user]);

  // Ưu tiên dùng tọa độ từ trình duyệt, nếu không có thì tìm trong hồ sơ (địa chỉ chính hoặc địa chỉ mặc định)
  const profileLat = user?.address?.latitude || user?.addresses?.find(a => a.isDefault)?.latitude;
  const profileLng = user?.address?.longitude || user?.addresses?.find(a => a.isDefault)?.longitude;

  const finalLat = coords?.lat || profileLat;
  const finalLng = coords?.lng || profileLng;

  const { data: waybills, refetch, isFetching } = useQuery<WaybillResponse[], ErrorMessage>(
    ['api', 'shipper', 'availableWaybills', finalLat, finalLng],
    () => FetchUtils.getWithToken(ResourceURL.SHIPPER_WAYBILL_AVAILABLE + (finalLat && finalLng ? `?lat=${finalLat}&lng=${finalLng}` : '')),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy danh sách không thành công'),
    }
  );

  const handleConfirmPickup = async (id: number) => {
    try {
      await FetchUtils.postWithToken(ResourceURL.SHIPPER_WAYBILL_CONFIRM_PICKUP(id), {});
      NotifyUtils.simpleSuccess('Xác nhận lấy hàng thành công');
      refetch();
    } catch (error) {
      NotifyUtils.simpleFailed('Xác nhận lấy hàng thất bại');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Đơn hàng sẵn sàng lấy</Title>
        <Button 
          variant="light" 
          leftIcon={<Truck size={18} />} 
          onClick={() => refetch()}
          loading={isFetching}
        >
          Làm mới
        </Button>
      </Group>

      <Paper shadow="xs" p="md">
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Mã vận đơn</th>
              <th>Kho lấy hàng</th>
              <th>Địa chỉ kho</th>
              <th>Người nhận</th>
              <th>Khoảng cách</th>
              <th>Tiền thu hộ (COD)</th>
              <th>Ngày hẹn giao</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {waybills && waybills.length > 0 ? (
              waybills.map((waybill) => {
                const distance = (finalLat && finalLng && waybill.fromWarehouse?.address?.latitude && waybill.fromWarehouse?.address?.longitude)
                  ? calculateDistance(finalLat, finalLng, waybill.fromWarehouse.address.latitude, waybill.fromWarehouse.address.longitude)
                  : null;

                return (
                  <tr key={waybill.id}>
                    <td><Text weight={500}>{waybill.code}</Text></td>
                    <td>{waybill.fromWarehouse?.name}</td>
                    <td>
                      {waybill.fromWarehouse?.address && (
                        <Stack spacing={0}>
                          <Text size="sm">{waybill.fromWarehouse.address.line}</Text>
                          <Text size="xs" color="dimmed">
                            {waybill.fromWarehouse.address.ward?.name}, {waybill.fromWarehouse.address.district?.name}, {waybill.fromWarehouse.address.province?.name}
                          </Text>
                        </Stack>
                      )}
                    </td>
                    <td>
                      <Stack spacing={0}>
                        <Text size="sm" weight={500}>{waybill.order?.toName}</Text>
                        <Text size="xs" color="dimmed">{waybill.order?.toPhone}</Text>
                      </Stack>
                    </td>
                    <td>
                      {!finalLat || !finalLng ? (
                        <Text size="xs" color="orange" sx={{ fontStyle: 'italic' }}>Chưa có tọa độ của bạn (GPS/Hồ sơ)</Text>
                      ) : !waybill.fromWarehouse?.address?.latitude || !waybill.fromWarehouse?.address?.longitude ? (
                        <Text size="xs" color="red" sx={{ fontStyle: 'italic' }}>Kho chưa có tọa độ</Text>
                      ) : (
                        <Badge color="blue" variant="filled">
                          {calculateDistance(
                            finalLat,
                            finalLng,
                            waybill.fromWarehouse.address.latitude,
                            waybill.fromWarehouse.address.longitude
                          ).toFixed(2)} km
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge color={waybill.codAmount > 0 ? 'red' : 'gray'} variant="filled">
                        {MiscUtils.formatPrice(waybill.codAmount)} ₫
                      </Badge>
                    </td>
                    <td>{DateUtils.isoDateToString(waybill.expectedDeliveryTime)}</td>
                    <td>
                      <Button 
                        size="xs" 
                        color="blue" 
                        onClick={() => handleConfirmPickup(waybill.id)}
                      >
                        Xác nhận lấy hàng
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8}>
                  <Text align="center" color="dimmed" py="xl">Hiện tại không có đơn hàng nào cần lấy.</Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}

export default ShipperWaybillManage;
