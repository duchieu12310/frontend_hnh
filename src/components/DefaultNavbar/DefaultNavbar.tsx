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
    link: '/admin/warehouses',
    label: 'Nhà kho',
    icon: BuildingWarehouse,
    childLinks: [
      {
        link: '/admin/warehouses/list',
        label: 'Danh sách kho',
      },
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
        className="flex flex-col gap-1 rounded-xl overflow-hidden group"
      >
        <Link
          to={navbarLink.link}
          onClick={() => setActive(navbarLink.label)}
          className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-4'} py-3 text-[14px] font-medium no-underline transition-all rounded-xl overflow-hidden group ${
            isActive || hasActiveChild
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          } ${
            isDisabled ? 'opacity-50 pointer-events-none' : ''
          }`}
          title={collapsed ? navbarLink.label : undefined}
        >
          {/* Active Gradient Background with Glassmorphism */}
          {(isActive || hasActiveChild) && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent backdrop-blur-sm -z-10" />
          )}
          {/* Indicated style */}
          {(isActive || hasActiveChild) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-blue-600 dark:bg-blue-400 rounded-r-md" />
          )}

          <navbarLink.icon size={20} strokeWidth={isActive || hasActiveChild ? 2 : 1.5} className={`${
            isActive || hasActiveChild
              ? 'text-blue-600 dark:text-blue-400 drop-shadow-sm'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors'
          }`} />
          {!collapsed && <span className="tracking-wide leading-relaxed">{navbarLink.label}</span>}
        </Link>
        {!collapsed && (isActive || hasActiveChild) && navbarLink.childLinks && navbarLink.childLinks.length > 0 && (
          <div className="flex flex-col ml-6 pl-3 border-l-[1.5px] border-gray-200 dark:border-gray-700/50 relative py-1 gap-1">
            {navbarLink.childLinks.map(childLink => {
              const isChildActive = location.pathname === childLink.link;
              return (
                <Link
                  key={childLink.label}
                  to={childLink.link}
                  className={`relative flex items-center px-4 py-2 text-[13.5px] font-medium transition-all rounded-lg group ${
                    isChildActive
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/30'
                  }`}
                >
                  <div className={`absolute -left-[13px] top-1/2 w-3 border-t-[1.5px] transition-colors ${
                    isChildActive ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700/50 group-hover:border-blue-300'
                  }`} />
                  <span className="tracking-wide">{childLink.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  });

  return (
    <nav
      className={`fixed left-4 top-20 h-[calc(100vh-6rem)] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-y-auto transition-all shadow-xl ${
        opened ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex flex-col gap-1.5 ${collapsed ? 'p-2' : 'p-4'}`}>
        {navbarLinksFragment}
      </div>
    </nav>
  );
}
