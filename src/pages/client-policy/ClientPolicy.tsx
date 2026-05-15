import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Title, Text, Stack, Card, Breadcrumbs, Anchor } from '@mantine/core';
import { ChevronRight, ShieldCheck, Truck, CreditCard, Scale, Help } from 'tabler-icons-react';
import useTitle from 'hooks/use-title';

const POLICY_DATA: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
  'dieu-khoan-chung': {
    title: 'Điều khoản và quy định chung',
    icon: <Scale size={32} />,
    content: (
      <Stack spacing="md">
        <Text>Chào mừng bạn đến với Hiếu Bookstore. Khi bạn truy cập vào trang web của chúng tôi có nghĩa là bạn đồng ý với các điều khoản này.</Text>
        <Title order={4}>1. Chấp nhận điều khoản</Title>
        <Text>Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào.</Text>
        <Title order={4}>2. Ý kiến khách hàng</Title>
        <Text>Tất cả nội dung trang web và ý kiến phê bình của quý khách đều là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông tin giả mạo nào, chúng tôi sẽ khóa tài khoản của quý khách ngay lập tức.</Text>
      </Stack>
    )
  },
  'chinh-sach-bao-mat': {
    title: 'Chính sách bảo mật thông tin',
    icon: <ShieldCheck size={32} />,
    content: (
      <Stack spacing="md">
        <Text>Chúng tôi coi trọng việc bảo mật thông tin và sử dụng các biện pháp tốt nhất bảo vệ thông tin và việc thanh toán của quý khách.</Text>
        <Title order={4}>1. Thu thập thông tin</Title>
        <Text>Chúng tôi thu thập thông tin tên, địa chỉ, số điện thoại để phục vụ việc giao hàng và chăm sóc khách hàng.</Text>
        <Title order={4}>2. Cam kết bảo mật</Title>
        <Text>Thông tin của quý khách sẽ không được cung cấp cho bên thứ ba nào ngoại trừ các đơn vị vận chuyển đối tác.</Text>
      </Stack>
    )
  },
  'phuong-thuc-thanh-toan': {
    title: 'Phương thức thanh toán',
    icon: <CreditCard size={32} />,
    content: (
      <Stack spacing="md">
        <Text>Hiếu Bookstore hỗ trợ nhiều phương thức thanh toán linh hoạt cho quý khách:</Text>
        <Title order={4}>1. Thanh toán khi nhận hàng (COD)</Title>
        <Text>Quý khách kiểm tra hàng và thanh toán tiền mặt cho nhân viên giao hàng.</Text>
        <Title order={4}>2. Chuyển khoản ngân hàng / Ví điện tử</Title>
        <Text>Hỗ trợ thanh toán qua VNPay, Momo, ZaloPay và chuyển khoản trực tiếp.</Text>
      </Stack>
    )
  },
  'chinh-sach-van-chuyen': {
    title: 'Chính sách vận chuyển và kiểm hàng',
    icon: <Truck size={32} />,
    content: (
      <Stack spacing="md">
        <Text>Chúng tôi cam kết giao hàng nhanh chóng và an toàn đến tận tay quý khách.</Text>
        <Title order={4}>1. Thời gian giao hàng</Title>
        <Text>Nội thành Hà Nội: 1-2 ngày. Các tỉnh thành khác: 3-5 ngày làm việc.</Text>
        <Title order={4}>2. Kiểm hàng</Title>
        <Text>Quý khách được quyền đồng kiểm cùng nhân viên giao hàng trước khi nhận sách.</Text>
      </Stack>
    )
  },
  'chinh-sach-bao-hanh': {
    title: 'Chính sách bảo hành và đổi trả',
    icon: <Help size={32} />,
    content: (
      <Stack spacing="md">
        <Text>Sách lỗi do nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển sẽ được đổi trả miễn phí.</Text>
        <Title order={4}>1. Điều kiện đổi trả</Title>
        <Text>Sách còn nguyên vẹn, không bị rách nát do người sử dụng. Có video mở hàng là một lợi thế.</Text>
        <Title order={4}>2. Thời hạn</Title>
        <Text>Quý khách có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.</Text>
      </Stack>
    )
  }
};

function ClientPolicy() {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? POLICY_DATA[slug] : null;

  useTitle(policy ? policy.title : 'Chính sách');

  if (!policy) {
    return (
      <Container size="md" py="xl">
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Text align="center">Không tìm thấy thông tin chính sách yêu cầu.</Text>
          <div className="flex justify-center mt-4">
            <Link to="/" className="text-blue-600 hover:underline">Quay lại trang chủ</Link>
          </div>
        </Card>
      </Container>
    );
  }

  const items = [
    { title: 'Trang chủ', href: '/' },
    { title: 'Chính sách', href: '#' },
    { title: policy.title, href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} color="dimmed" size="sm">
      {item.title}
    </Anchor>
  ));

  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <Container size="md">
        <Breadcrumbs separator={<ChevronRight size={14} />} mb="xl">
          {items}
        </Breadcrumbs>

        <Card shadow="lg" p={40} radius={20} withBorder className="bg-white dark:bg-gray-800 border-none shadow-blue-500/5">
          <Stack spacing="xl">
            <div className="flex items-center gap-4 text-blue-600 dark:text-blue-400">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                {policy.icon}
              </div>
              <Title order={1} className="text-3xl font-bold text-gray-900 dark:text-white">
                {policy.title}
              </Title>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

            <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {policy.content}
            </div>
          </Stack>
        </Card>
      </Container>
    </main>
  );
}

export default ClientPolicy;
