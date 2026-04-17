import React, { useState } from 'react';
import { Badge, Button, Divider, Grid, Group, Loader, NumberInput, Paper, Select, Stack, Text, Textarea } from '@mantine/core';
import { CreateUpdateTitle, DefaultPropertyPanel } from 'components';
import WaybillConfigs from './WaybillConfigs_v2';
import useWaybillCreateViewModel from 'pages/waybill/WaybillCreate.vm';
import { DatePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { SelectOption } from 'types';
import useGetAllApi from 'hooks/use-get-all-api';
import { OrderResponse } from 'models/Order';
import OrderConfigs from 'pages/order/OrderConfigs';
import DateUtils from 'utils/DateUtils';

import { User, Phone, MapPin, Coin, ShoppingCart, InfoCircle } from 'tabler-icons-react';
import MiscUtils from 'utils/MiscUtils';

function WaybillCreate() {

  const {
    form,
    handleFormSubmit,
    ghnRequiredNoteSelectList,
  } = useWaybillCreateViewModel();

  const [orderSelectKeyword, setOrderSelectKeyword] = useState('');
  const [orderSelectDebouncedKeyword] = useDebouncedValue(orderSelectKeyword, 400);
  const [orderSelectList, setOrderSelectList] = useState<SelectOption[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  React.useEffect(() => {
    if (form.values.orderId) {
      const order = orders.find((o) => String(o.id) === String(form.values.orderId));
      if (order) {
        setSelectedOrder(order);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [form.values.orderId, orders]);

  const { isFetching: isFetchingOrderListResponse } = useGetAllApi<OrderResponse>(
    OrderConfigs.resourceUrl,
    OrderConfigs.resourceKey,
    { size: 5, filter: 'status==1', search: orderSelectDebouncedKeyword },
    (orderListResponse) => {
      setOrders(orderListResponse.content);
      const selectList: SelectOption[] = orderListResponse.content.map((item) => ({
        value: String(item.id),
        label: item.code,
      }));
      setOrderSelectList(selectList);
    }
  );

  return (
    <Stack sx={{ maxWidth: 800 }}>
      <CreateUpdateTitle
        managerPath={WaybillConfigs.managerPath}
        title={WaybillConfigs.createTitle}
      />

      <DefaultPropertyPanel/>

      <form onSubmit={handleFormSubmit}>
        <Paper shadow="xs">
          <Stack spacing={0}>
            <Grid p="sm">
              <Grid.Col>
                <Select
                  required
                  rightSection={isFetchingOrderListResponse ? <Loader size={16}/> : null}
                  label="Đơn hàng"
                  placeholder="Nhập mã đơn hàng và chọn đơn hàng"
                  searchable
                  clearable
                  onSearchChange={setOrderSelectKeyword}
                  data={orderSelectList}
                  {...form.getInputProps('orderId')}
                />
              </Grid.Col>

              {selectedOrder && (
                <Grid.Col>
                  <Paper withBorder p="md" radius="md" className="bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <Stack spacing="xs">
                      <Group spacing="xs" mb={4}>
                        <InfoCircle size={18} className="text-blue-600 dark:text-blue-400" />
                        <Text size="sm" weight={700} className="uppercase tracking-wider text-blue-700 dark:text-blue-300">Chi tiết đơn hàng đã chọn</Text>
                      </Group>

                      <Divider size="xs" color="blue" sx={{ opacity: 0.1 }} />

                      <Grid grow gutter="md">
                        <Grid.Col sm={6}>
                          <Stack spacing={8}>
                            <Group spacing={8}>
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
                                <User size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <Text size="xs" color="dimmed" weight={500}>Thông tin người nhận</Text>
                                <Text weight={600} size="sm">{selectedOrder.toName}</Text>
                              </div>
                            </Group>

                            <Group spacing={8}>
                              <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg text-green-600 dark:text-green-400">
                                <Phone size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <Text size="xs" color="dimmed" weight={500}>Số điện thoại</Text>
                                <Text weight={600} size="sm">{selectedOrder.toPhone}</Text>
                              </div>
                            </Group>
                          </Stack>
                        </Grid.Col>

                        <Grid.Col sm={6}>
                          <Stack spacing={8}>
                            <Group spacing={8}>
                              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg text-orange-600 dark:text-orange-400">
                                <Coin size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <Text size="xs" color="dimmed" weight={500}>Số tiền cần thanh toán</Text>
                                <Text weight={700} size="md" color="blue" className="font-mono">
                                  {MiscUtils.formatPrice(selectedOrder.totalPay)} ₫
                                </Text>
                              </div>
                            </Group>

                            <Group spacing={8}>
                              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600 dark:text-purple-400">
                                <ShoppingCart size={16} />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <Text size="xs" color="dimmed" weight={500}>Nguồn đơn / Quy cách</Text>
                                <Group spacing={4}>
                                  <Badge size="xs" variant="filled" color="indigo">{selectedOrder.orderResource.name}</Badge>
                                  <Badge size="xs" variant="outline" color="gray">{selectedOrder.orderVariants?.length || 0} sản phẩm</Badge>
                                </Group>
                              </div>
                            </Group>
                          </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                          <Group spacing={8} align="flex-start">
                            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400 shrink-0">
                              <MapPin size={16} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <Text size="xs" color="dimmed" weight={500}>Địa chỉ nhận hàng</Text>
                              <Text size="sm" sx={{ fontStyle: 'italic' }} weight={500}>
                                {[selectedOrder.toAddress, selectedOrder.toWardName, selectedOrder.toDistrictName, selectedOrder.toProvinceName].join(', ')}
                              </Text>
                            </div>
                          </Group>
                        </Grid.Col>
                      </Grid>
                    </Stack>
                  </Paper>
                </Grid.Col>
              )}
              <Grid.Col>
                <DatePicker
                  required
                  locale="vi"
                  inputFormat="DD/MM/YYYY"
                  labelFormat="MM/YYYY"
                  label="Ngày gửi hàng"
                  minDate={DateUtils.today()}
                  {...form.getInputProps('shippingDate')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumberInput
                  required
                  min={1}
                  max={30000}
                  label="Khối lượng kiện hàng"
                  description="Tính theo gram. Tối đa 30.000 gram."
                  {...form.getInputProps('weight')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumberInput
                  required
                  min={1}
                  max={150}
                  label="Chiều dài kiện hàng"
                  description="Tính theo cm. Tối đa 150 cm."
                  {...form.getInputProps('length')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumberInput
                  required
                  min={1}
                  max={150}
                  label="Chiều rộng kiện hàng"
                  description="Tính theo cm. Tối đa 150 cm."
                  {...form.getInputProps('width')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <NumberInput
                  required
                  min={1}
                  max={150}
                  label="Chiều cao kiện hàng"
                  description="Tính theo cm. Tối đa 150 cm."
                  {...form.getInputProps('height')}
                />
              </Grid.Col>
              <Grid.Col>
                <Textarea
                  label="Ghi chú vận đơn"
                  {...form.getInputProps('note')}
                />
              </Grid.Col>
              <Grid.Col xs={6}>
                <Select
                  required
                  label="Ghi chú cho dịch vụ GHN"
                  placeholder="--"
                  data={ghnRequiredNoteSelectList}
                  {...form.getInputProps('ghnRequiredNote')}
                />
              </Grid.Col>
            </Grid>

            <Divider mt="xs"/>

            <Group position="apart" p="sm">
              <Button variant="default" onClick={form.reset}>Mặc định</Button>
              <Button type="submit">Thêm</Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Stack>
  );
}

export default WaybillCreate;
