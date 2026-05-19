import React, { useState } from 'react';
import { Card, Grid, Group, MantineColor, Paper, SegmentedControl, Stack, Table, Text, Title, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import {
  Box,
  BrandApple,
  BuildingWarehouse,
  CurrencyDollar,
  FileBarcode,
  Icon,
  Percentage,
  Star,
  Truck,
  TrendingDown,
  TrendingUp,
  Users
} from 'tabler-icons-react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from 'react-query';
import FetchUtils, { ErrorMessage } from 'utils/FetchUtils';
import ResourceURL from 'constants/ResourceURL';
import NotifyUtils from 'utils/NotifyUtils';
import { ProductSalesStatistic, StatisticResource, StatisticResponse } from 'models/Statistic';
import DateUtils from 'utils/DateUtils';
import MiscUtils from 'utils/MiscUtils';
import { useNavigate } from 'react-router-dom';
import ManagerPath from 'constants/ManagerPath';

const dateReducerForStatisticResources = (statisticResources: StatisticResource[]) => statisticResources.map((statisticResource) => ({
  date: DateUtils.isoDateToString(statisticResource.date, 'DD/MM/YY'),
  total: statisticResource.total,
}));

// Group dữ liệu theo ngày và tổng hợp lại (tránh trùng lặp ngày)
// Input: array of { date: string, total: number } (đã được format)
const groupByDate = (data: Array<{ date: string, total: number }>): Array<{ date: string, total: number }> => {
  const grouped = new Map<string, number>();
  
  data.forEach(item => {
    const dateKey = item.date;
    const currentTotal = grouped.get(dateKey) || 0;
    grouped.set(dateKey, currentTotal + item.total);
  });
  
  return Array.from(grouped.entries())
    .map(([date, total]) => ({
      date,
      total,
    }))
    .sort((a, b) => {
      // Sort theo ngày (format DD/MM/YY)
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      const dateA = new Date(2000 + yearA, monthA - 1, dayA);
      const dateB = new Date(2000 + yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();
    });
};

// Filter dữ liệu chỉ lấy năm hiện tại
const filterCurrentYear = (statisticResources: StatisticResource[]): StatisticResource[] => {
  const cutoff = dayjs().startOf('year');
  return statisticResources.filter(item => {
    const itemDate = dayjs(item.date);
    return itemDate.isAfter(cutoff) || itemDate.isSame(cutoff);
  });
};

// Filter dữ liệu trong khoảng N ngày gần nhất
const filterLastDays = (statisticResources: StatisticResource[], days: number): StatisticResource[] => {
  const cutoff = dayjs().subtract(days, 'day').startOf('day');
  return statisticResources.filter(item => {
    const itemDate = dayjs(item.date);
    return itemDate.isAfter(cutoff) || itemDate.isSame(cutoff);
  });
};

// Group dữ liệu theo tháng của năm hiện tại
const groupByMonthForCurrentYear = (statisticResources: StatisticResource[]): Array<{ date: string, total: number }> => {
  const currentYear = dayjs().year();
  const monthlyTotals = new Map<number, number>();
  for (let i = 1; i <= 12; i++) {
    monthlyTotals.set(i, 0);
  }

  statisticResources.forEach(item => {
    const itemDate = dayjs(item.date);
    if (itemDate.year() === currentYear) {
      const month = itemDate.month() + 1; // 1-indexed
      monthlyTotals.set(month, (monthlyTotals.get(month) || 0) + item.total);
    }
  });

  return Array.from(monthlyTotals.entries()).map(([month, total]) => ({
    date: `Thg ${month}`,
    total,
  }));
};

const getRevenueChartData = (data: StatisticResource[], period: 'week' | 'month' | 'year') => {
  if (!data) return [];
  if (period === 'week') {
    const filtered = filterLastDays(data, 7);
    return dateReducerForStatisticResources(filtered);
  } else if (period === 'month') {
    const filtered = filterLastDays(data, 30);
    return dateReducerForStatisticResources(filtered);
  } else {
    return groupByMonthForCurrentYear(data);
  }
};

const getOrderChartData = (data: StatisticResource[], period: 'week' | 'month' | 'year') => {
  if (!data) return [];
  if (period === 'week') {
    const filtered = filterLastDays(data, 7);
    return groupByDate(dateReducerForStatisticResources(filtered));
  } else if (period === 'month') {
    const filtered = filterLastDays(data, 30);
    return groupByDate(dateReducerForStatisticResources(filtered));
  } else {
    return groupByMonthForCurrentYear(data);
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const { statisticResponse } = useGetStatisticApi(period);
  const statistic = statisticResponse as StatisticResponse;

  // Tính doanh thu tuần (7 ngày gần nhất)
  const calculateWeeklyRevenue = () => {
    if (!statistic.statisticRevenue || statistic.statisticRevenue.length === 0) return 0;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return statistic.statisticRevenue
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= weekAgo && itemDate <= now;
      })
      .reduce((sum, item) => sum + item.total, 0);
  };

  // Tính doanh thu tháng (30 ngày gần nhất)
  const calculateMonthlyRevenue = () => {
    if (!statistic.statisticRevenue || statistic.statisticRevenue.length === 0) return 0;
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return statistic.statisticRevenue
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= monthAgo && itemDate <= now;
      })
      .reduce((sum, item) => sum + item.total, 0);
  };

  // Tính doanh thu quý (90 ngày gần nhất)
  const calculateQuarterlyRevenue = () => {
    if (!statistic.statisticRevenue || statistic.statisticRevenue.length === 0) return 0;
    const now = new Date();
    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    return statistic.statisticRevenue
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= quarterAgo && itemDate <= now;
      })
      .reduce((sum, item) => sum + item.total, 0);
  };

  // Tính doanh thu năm (365 ngày gần nhất)
  const calculateYearlyRevenue = () => {
    if (!statistic.statisticRevenue || statistic.statisticRevenue.length === 0) return 0;
    const now = new Date();
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    return statistic.statisticRevenue
      .filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= yearAgo && itemDate <= now;
      })
      .reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <Stack mb={30}>
      <Group position="apart">
        <Title order={3}>Thống kê hệ thống</Title>
        <SegmentedControl
          value={period}
          onChange={(value: 'week' | 'month' | 'year') => setPeriod(value)}
          data={[
            { label: 'Theo tuần', value: 'week' },
            { label: 'Theo tháng', value: 'month' },
            { label: 'Theo năm', value: 'year' },
          ]}
          size="sm"
        />
      </Group>

      <Paper shadow="xs" p="md">
        <Stack>
          <Text size="lg" weight={500} color="dimmed">Tổng quan</Text>
          <Grid>
            <Grid.Col span={3}>
              <OverviewCard title="Tổng số khách hàng" number={statistic.totalCustomer} color="blue" icon={Users} onClick={() => navigate(ManagerPath.USER)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Tổng số sản phẩm" number={statistic.totalProduct} color="orange" icon={Box} onClick={() => navigate(ManagerPath.PRODUCT)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Tổng số đơn hàng" number={statistic.totalOrder} color="teal" icon={FileBarcode} onClick={() => navigate(ManagerPath.ORDER)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Tổng số vận đơn" number={statistic.totalWaybill} color="grape" icon={Truck} onClick={() => navigate(ManagerPath.WAYBILL)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Đơn hàng đã giao" number={statistic.totalDeliveredOrder} color="green" icon={FileBarcode} onClick={() => navigate(ManagerPath.ORDER)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Vận đơn đã hoàn thành" number={statistic.totalCompletedWaybill} color="indigo" icon={Truck} onClick={() => navigate(ManagerPath.WAYBILL)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard title="Tổng số đánh giá" number={statistic.totalReview} color="yellow" icon={Star} onClick={() => navigate(ManagerPath.REVIEW)} />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard
                title="Tổng số khuyến mãi hiện tại"
                number={statistic.totalActivePromotion}
                color="pink"
                icon={Percentage}
                onClick={() => navigate(ManagerPath.PROMOTION)}
              />
            </Grid.Col>

            <Grid.Col span={3}>
              <OverviewCard 
                title="Tổng doanh thu" 
                number={statistic.statisticRevenue?.reduce((sum, item) => sum + item.total, 0) || 0} 
                color="green" 
                icon={CurrencyDollar}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard 
                title="Doanh thu tuần" 
                number={calculateWeeklyRevenue()} 
                color="lime" 
                icon={CurrencyDollar}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard 
                title="Doanh thu tháng" 
                number={calculateMonthlyRevenue()} 
                color="cyan" 
                icon={CurrencyDollar}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard 
                title="Doanh thu quý" 
                number={calculateQuarterlyRevenue()} 
                color="orange" 
                icon={CurrencyDollar}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <OverviewCard 
                title="Doanh thu năm" 
                number={calculateYearlyRevenue()} 
                color="red" 
                icon={CurrencyDollar}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>

      <Grid>
        {/* <Grid.Col lg={6}>
          <Paper shadow="xs" p="md">
            <Stack>
              <Group position="apart">
                <Text size="lg" weight={500} color="dimmed">Lượt đăng ký tài khoản</Text>
                <Text size="sm" color="dimmed">7 ngày gần nhất</Text>
              </Group>

              <LineChart
                width={650}
                height={275}
                data={dateReducerForStatisticResources(filterCurrentYear(statistic.statisticRegistration))}
                margin={{ top: 10, right: 5, bottom: 0, left: -10 }}
              >
                <XAxis dataKey="date"/>
                <YAxis 
                  allowDecimals={false}
                  tickFormatter={(value) => Math.round(value).toString()}
                />
                <Tooltip/>
                <Line
                  name="Số lượt đăng ký"
                  type="monotone"
                  dataKey="total"
                  stroke={theme.colors.blue[5]}
                />
              </LineChart>
            </Stack>
          </Paper>
        </Grid.Col> */}
         <Grid.Col lg={6}>
          <Paper shadow="xs" p="md">
            <Stack>
              <Group position="apart">
                <Text size="lg" weight={500} color="dimmed">Doanh thu</Text>
                <Text size="sm" color="dimmed">
                  {period === 'week' ? '7 ngày gần nhất' : period === 'month' ? '30 ngày gần nhất' : 'Các tháng trong năm'}
                </Text>
              </Group>

              <ResponsiveContainer width="100%" height={275}>
                <BarChart
                  data={getRevenueChartData(statistic.statisticRevenue, period)}
                  margin={{ top: 10, right: 5, bottom: 0, left: -10 }}
                >
                  <XAxis dataKey="date"/>
                  <YAxis 
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      } else if (value >= 1000) {
                        return `${(value / 1000).toFixed(0)}K`;
                      }
                      return value.toString();
                    }}
                  />
                  <Tooltip formatter={(value: number) => `${MiscUtils.formatPrice(value)} VNĐ`}/>
                  <Bar
                    name="Doanh thu"
                    dataKey="total"
                    fill={theme.colors.green[5]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Stack>
          </Paper>
        </Grid.Col>
         <Grid.Col lg={6}>
           <Paper shadow="xs" p="md">
             <Stack>
               <Group position="apart">
                 <Text size="lg" weight={500} color="dimmed">Lượt đặt hàng</Text>
                 <Text size="sm" color="dimmed">
                   {period === 'week' ? '7 ngày gần nhất' : period === 'month' ? '30 ngày gần nhất' : 'Các tháng trong năm'}
                 </Text>
               </Group>

               <ResponsiveContainer width="100%" height={275}>
                 <LineChart
                   data={getOrderChartData(statistic.statisticOrder, period)}
                   margin={{ top: 10, right: 5, bottom: 0, left: -10 }}
                 >
                   <XAxis dataKey="date"/>
                   <YAxis 
                     allowDecimals={false}
                     tickFormatter={(value) => Math.round(value).toString()}
                   />
                   <Tooltip/>
                   <Line
                     name="Số lượt đặt hàng"
                     type="monotone"
                     dataKey="total"
                     stroke={theme.colors.teal[5]}
                     strokeWidth={2}
                     dot={{ r: 4 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </Stack>
           </Paper>
         </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col lg={6}>
          <Paper shadow="xs" p="md">
            <Stack>
              <Group position="apart">
                <Group spacing="xs">
                  <TrendingUp size={20} color={theme.colors.green[6]} />
                  <Text size="lg" weight={500} color="dimmed">Sản phẩm bán chạy</Text>
                </Group>
                <Text size="sm" color="dimmed">
                  {period === 'week' ? '7 ngày gần nhất' : period === 'month' ? '30 ngày gần nhất' : '365 ngày gần nhất'}
                </Text>
              </Group>

              {statistic.topSellingProducts && statistic.topSellingProducts.length > 0 ? (
                <Table striped highlightOnHover>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sản phẩm</th>
                      <th>Mã sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistic.topSellingProducts.map((product, index) => (
                      <tr key={product.productId}>
                        <td>{index + 1}</td>
                        <td>{product.productName}</td>
                        <td>{product.productCode}</td>
                        <td>{product.totalQuantitySold}</td>
                        <td>{MiscUtils.formatPrice(product.totalRevenue)} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Text size="sm" color="dimmed" align="center" py="md">
                  Chưa có dữ liệu sản phẩm bán chạy trong {period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'} này
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col lg={6}>
          <Paper shadow="xs" p="md">
            <Stack>
              <Group position="apart">
                <Group spacing="xs">
                  <TrendingDown size={20} color={theme.colors.red[6]} />
                  <Text size="lg" weight={500} color="dimmed">Sản phẩm bán chậm</Text>
                </Group>
                <Text size="sm" color="dimmed">
                  {period === 'week' ? '7 ngày gần nhất' : period === 'month' ? '30 ngày gần nhất' : '365 ngày gần nhất'}
                </Text>
              </Group>

              {statistic.slowSellingProducts && statistic.slowSellingProducts.length > 0 ? (
                <Table striped highlightOnHover>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sản phẩm</th>
                      <th>Mã sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistic.slowSellingProducts.map((product, index) => (
                      <tr key={product.productId}>
                        <td>{index + 1}</td>
                        <td>{product.productName}</td>
                        <td>{product.productCode}</td>
                        <td>{product.totalQuantitySold}</td>
                        <td>{MiscUtils.formatPrice(product.totalRevenue)} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Text size="sm" color="dimmed" align="center" py="md">
                  Tất cả sản phẩm đều có bán trong {period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : 'năm'} này
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

    </Stack>
  );
}

interface OverviewCardProps {
  title: string;
  number: number;
  color: MantineColor;
  icon: Icon;
  onClick?: () => void;
}

function OverviewCard({ title, number, color, icon, onClick }: OverviewCardProps) {
  const theme = useMantineTheme();

  const Icon = icon;

  return (
    <Card 
      onClick={onClick}
      sx={{
        backgroundColor: theme.colors[color][theme.colorScheme === 'dark' ? 9 : 1],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        } : undefined
      }}
    >
      <Group>
        <Icon size={40} strokeWidth={1.25}/>
        <Stack spacing={2.5}>
          <Text>{title}</Text>
          <Text size="xl" weight={500}>{number}</Text>
        </Stack>
      </Group>
    </Card>
  );
}

const defaultStatisticResponse: StatisticResponse = {
  totalCustomer: 0,
  totalProduct: 0,
  totalOrder: 0,
  totalDeliveredOrder: 0,
  totalWaybill: 0,
  totalCompletedWaybill: 0,
  totalReview: 0,
  totalActivePromotion: 0,
  totalSupplier: 0,
  totalBrand: 0,
  statisticRegistration: [],
  statisticOrder: [],
  statisticReview: [],
  statisticWaybill: [],
  statisticRevenue: [],
  topSellingProducts: [],
  slowSellingProducts: [],
};

function useGetStatisticApi(period: string) {
  const {
    data: statisticResponse,
    isLoading: isLoadingStatisticResponse,
    isError: isErrorStatisticResponse,
  } = useQuery<StatisticResponse, ErrorMessage>(
    ['api', 'stats', 'getStatistic', period],
    () => FetchUtils.getWithToken(`${ResourceURL.STATISTIC}?period=${period}`),
    {
      onError: () => NotifyUtils.simpleFailed('Lấy dữ liệu không thành công'),
      keepPreviousData: true,
      initialData: defaultStatisticResponse,
    }
  );

  return { statisticResponse, isLoadingStatisticResponse, isErrorStatisticResponse };
}

export default AdminDashboard;
