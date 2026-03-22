import React, { useState } from 'react';
import {
  AddressBook,
  Award,
  Box,
  Building,
  BuildingWarehouse,
  Car,
  CurrencyDollar,
  FileBarcode,
  Fingerprint,
  Home,
  Icon,
  Message,
  Users
} from 'tabler-icons-react';
import { Link, useLocation } from 'react-router-dom';
import useAppStore from 'stores/use-app-store';
import useAdminAuthStore from 'stores/use-admin-auth-store';

interface NavbarLink {
  link: string;
  label: string;
  icon: Icon;
  childLinks?: NavbarChildLink[];
  disableForEmployee?: boolean;
}

interface NavbarChildLink {
  link: string;
  label: string;
}

const navbarLinks: NavbarLink[] = [
  {
    link: '/admin',
    label: 'Trang chủ',
    icon: Home,
  },
  // {
  //   link: '/admin/address',
  //   label: 'Địa chỉ',
  //   icon: AddressBook,
  //   childLinks: [
  //     {
  //       link: '/admin/address/province',
  //       label: 'Tỉnh thành',
  //     },
  //     {
  //       link: '/admin/address/district',
  //       label: 'Quận huyện',
  //     },
  //     // {
  //     //   link: '/admin/address/ward',
  //     //   label: 'Phường xã',
  //     // },
  //   ],
  //   disableForEmployee: true,
  // },
  {
    link: '/admin/user',
    label: 'Người dùng',
    icon: Fingerprint,
    childLinks: [
      {
        link: '/admin/user/role',
        label: 'Quyền',
      },
    ],
    disableForEmployee: true,
  },
  // TODO: TẠM THỜI COMMENT - ĐƠN GIẢN HÓA HỆ THỐNG (XÓA CUSTOMER VÀ EMPLOYEE)
  // {
  //   link: '/admin/employee',
  //   label: 'Nhân viên',
  //   icon: Building,
  //   disableForEmployee: true,
  // },
  //   childLinks: [
  //     {
  //       link: '/admin/employee/office',
  //       label: 'Văn phòng',
  //     },
  //     {
  //       link: '/admin/employee/department',
  //       label: 'Phòng ban',
  //     },
  //     {
  //       link: '/admin/employee/job-type',
  //       label: 'Loại hình công việc',
  //     },
  //     {
  //       link: '/admin/employee/job-level',
  //       label: 'Cấp bậc công việc',
  //     },
  //     {
  //       link: '/admin/employee/job-title',
  //       label: 'Chức danh công việc',
  //     },
  //   ],
  //   disableForEmployee: true,
  // },
  // {
  //   link: '/admin/customer',
  //   label: 'Khách hàng',
  //   icon: Users,
  // },
  //   childLinks: [
  //     {
  //       link: '/admin/customer/group',
  //       label: 'Nhóm khách hàng',
  //     },
  //     {
  //       link: '/admin/customer/status',
  //       label: 'Trạng thái khách hàng',
  //     },
  //     {
  //       link: '/admin/customer/resource',
  //       label: 'Nguồn khách hàng',
  //     },
  //   ],
  //   disableForEmployee: true,
  // },
  {
    link: '/admin/category',
    label: 'Thể loại',
    icon: Box
  },
  {
    link: '/admin/product',
    label: 'Sách',
    icon: Box,
    childLinks: [
      // {
      //   link: '/admin/category',
      //   label: 'Danh mục sản phẩm',
      // },
      {
        link: '/admin/product/brand',
        label: 'Tác giả',
      },
      {
        link: '/admin/product/supplier',
        label: 'Nhà xuất bản',
      },
      {
        link: '/admin/product/unit',
        label: 'Đơn vị tính',
      },
      {
        link: '/admin/product/tag',
        label: 'Tag',
      },
      // {
      //   link: '/admin/product/guarantee',
      //   label: 'Bảo hành',
      // },
      {
        link: '/admin/product/property',
        label: 'Thuộc tính sách',
      },
      {
        link: '/admin/product/specification',
        label: 'Thông số sách',
      },
    ],
    disableForEmployee: true,
  },
  {
    link: '/admin/product/guarantee',
    label: 'Bảo hành',
    icon: Box,
  },
  {
    link: '/admin/inventory',
    label: 'Tồn kho',
    icon: BuildingWarehouse,
    childLinks: [
      // TODO: TẠM THỜI COMMENT - ĐƠN GIẢN HÓA HỆ THỐNG KHO (CHỈ GIỮ TỒN KHO VÀ PHIẾU NHẬP XUẤT KHO)
      // {
      //   link: '/admin/inventory/warehouse',
      //   label: 'Nhà kho',
      // },
      // {
      //   link: '/admin/inventory/purchase-order',
      //   label: 'Đơn mua hàng',
      // },
      // {
      //   link: '/admin/inventory/destination',
      //   label: 'Điểm nhập hàng',
      // },
      {
        link: '/admin/inventory/docket',
        label: 'Phiếu nhập xuất kho',
      },
      // {
      //   link: '/admin/inventory/docket-reason',
      //   label: 'Lý do phiếu NXK',
      // },
      // {
      //   link: '/admin/inventory/count',
      //   label: 'Phiếu kiểm kho',
      // },
      // {
      //   link: '/admin/inventory/transfer',
      //   label: 'Phiếu chuyển kho',
      // },
    ],
    disableForEmployee: true,
  },
  {
    link: '/admin/order',
    label: 'Đơn hàng',
    icon: FileBarcode,
    // childLinks: [
    //   {
    //     link: '/admin/order/resource',
    //     label: 'Nguồn đơn hàng',
    //   },
    //   {
    //     link: '/admin/order/cancellation-reason',
    //     label: 'Lý do hủy đơn hàng',
    //   },
    // ],
  },
  {
    link: '/admin/waybill',
    label: 'Vận đơn',
    icon: Car,
    childLinks: [],
  },
  {
    link: '/admin/review',
    label: 'Đánh giá',
    icon: Message,
    childLinks: [],
  },
  // {
  //   link: '/admin/reward-strategy',
  //   label: 'Điểm thưởng',
  //   icon: Award,
  //   childLinks: [],
  //   disableForEmployee: true,
  // },
  // {
  //   link: '/admin/payment-method',
  //   label: 'Hình thức thanh toán',
  //   icon: CurrencyDollar,
  // },
  {
    link: '/admin/promotion',
    label: 'Khuyến mãi',
    icon: CurrencyDollar,
  },
  // {
  //   link: '/admin/voucher',
  //   label: 'Sổ quỹ',
  //   icon: CurrencyDollar,
  //   childLinks: [
  //     {
  //       link: '/admin/payment-method',
  //       label: 'Hình thức thanh toán',
  //     },
  //     {
  //       link: '/admin/promotion',
  //       label: 'Khuyến mãi',
  //     },
  //   ],
  //   disableForEmployee: true,
  // },
];

export function DefaultNavbar() {
  const { opened, collapsed } = useAppStore();
  const location = useLocation();
  const [active, setActive] = useState('Trang chủ');

  const { isOnlyEmployee } = useAdminAuthStore();

  React.useEffect(() => {
    // Set active based on current location
    const currentLink = navbarLinks.find(link => 
      location.pathname === link.link || 
      (link.childLinks && link.childLinks.some(child => location.pathname === child.link))
    );
    if (currentLink) {
      setActive(currentLink.label);
    }
  }, [location.pathname]);

  const navbarLinksFragment = navbarLinks.map(navbarLink => {
    const isActive = navbarLink.label === active;
    const isDisabled = isOnlyEmployee() && navbarLink.disableForEmployee;
    const hasActiveChild = navbarLink.childLinks?.some(child => location.pathname === child.link);

    return (
      <div
        key={navbarLink.label}
        className="rounded-md overflow-hidden"
      >
        <Link
          to={navbarLink.link}
          onClick={() => setActive(navbarLink.label)}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-4'} py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 no-underline transition-all rounded-lg ${
            isActive || hasActiveChild
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
          } ${
            isDisabled ? 'opacity-50 pointer-events-none' : ''
          }`}
          title={collapsed ? navbarLink.label : undefined}
        >
          <navbarLink.icon size={20} strokeWidth={1.5} className={`${
            isActive || hasActiveChild
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`} />
          {!collapsed && <span>{navbarLink.label}</span>}
        </Link>
        {!collapsed && (isActive || hasActiveChild) && (navbarLink.childLinks || []).map(childLink => {
          const isChildActive = location.pathname === childLink.link;
          return (
            <Link
              key={childLink.label}
              to={childLink.link}
              className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all rounded-lg ml-4 ${
                isChildActive
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isChildActive
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-gray-400 dark:bg-gray-500'
                }`} />
              </div>
              <span>{childLink.label}</span>
            </Link>
          );
        })}
      </div>
    );
  });

  return (
    <nav
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-all shadow-sm ${
        opened ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex flex-col gap-1 ${collapsed ? 'p-2' : 'p-4'}`}>
        {navbarLinksFragment}
      </div>
    </nav>
  );
}
