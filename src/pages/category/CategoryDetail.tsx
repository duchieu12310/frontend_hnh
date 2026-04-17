import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Paper, Stack, Title } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { EntityDetailTable, ManageHeader, ManageHeaderTitle, ManageTable } from 'components';
import { FilePlus } from 'tabler-icons-react';
import CategoryConfigs from 'pages/category/CategoryConfigs';
import DateUtils from 'utils/DateUtils';
import { CategoryResponse } from 'models/Category';
import useDeleteByIdApi from 'hooks/use-delete-by-id-api';

function CategoryDetail() {
  const { id } = useParams();
  const entityId = Number(id);
  const navigate = useNavigate();
  const deleteByIdApi = useDeleteByIdApi(CategoryConfigs.resourceUrl, CategoryConfigs.resourceKey);

  const categoryStatusBadgeFragment = (status: number) => {
    if (status === 1) {
      return <span className="px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded">Có hiệu lực</span>;
    }

    return <span className="px-2 py-1 text-xs font-medium border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded">Vô hiệu lực</span>;
  };

  const entityDetailTableRowsFragment = (entity: CategoryResponse) => (
    <>
      <tr>
        <td>{CategoryConfigs.properties.id.label}</td>
        <td>{entity.id}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.createdAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.createdAt)}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.updatedAt.label}</td>
        <td>{DateUtils.isoDateToString(entity.updatedAt)}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.name.label}</td>
        <td>{entity.name}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.slug.label}</td>
        <td>{entity.slug}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.level.label}</td>
        <td>{entity.level}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties['parentCategory.name'].label}</td>
        <td>{entity.parentCategory ? entity.parentCategory.name : <em>không có</em>}</td>
      </tr>
      <tr>
        <td>{CategoryConfigs.properties.status.label}</td>
        <td>{categoryStatusBadgeFragment(entity.status)}</td>
      </tr>
      <tr className="border-t border-gray-200 dark:border-gray-700">
        <td colSpan={2} className="py-4">
          <p className="font-semibold mb-3">Danh sách thể loại con</p>
          {(entity.children?.length || 0) > 0 ? (
            <ManageTable
              listResponse={{
                content: entity.children,
                page: 1,
                size: entity.children?.length || 0,
                totalElements: entity.children?.length || 0,
                totalPages: 1,
                last: true,
              }}
              properties={CategoryConfigs.properties}
              resourceUrl={CategoryConfigs.resourceUrl}
              resourceKey={CategoryConfigs.resourceKey}
              showedPropertiesFragment={(child: CategoryResponse) => (
                <>
                  <td>{child.id}</td>
                  <td className="text-sm">{child.name}</td>
                  <td className="text-sm">{child.slug}</td>
                  <td className="text-sm">{child.level}</td>
                  <td>{child.parentCategory ? child.parentCategory.name : <em>không có</em>}</td>
                  <td>{categoryStatusBadgeFragment(child.status)}</td>
                </>
              )}
              entityDetailTableRowsFragment={() => <></>}
              entityDetailActionsFragment={() => <></>}
              actionButtonsFragment={(childEntity) => {
                if (childEntity.level >= 2) return null;
                return (
                  <Link
                    to={`/admin/category/create?parentCategoryId=${childEntity.id}`}
                    title="Thêm thể loại con"
                    className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors inline-block"
                  >
                    <FilePlus size={16}/>
                  </Link>
                );
              }}
              hideEdit={true}
              hideDelete={true}
              customViewEntityLink={(childEntity) => `/admin/category/detail/${childEntity.id}`}
            />
          ) : <em>không có danh sách con</em>}
        </td>
      </tr>
    </>
  );

  const modals = useModals();

  const openDeleteModal = (entityId: number) => modals.openConfirmModal({
    title: <div className="text-lg font-semibold">Xác nhận xóa</div>,
    children: (
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Xóa phần tử có ID {entityId}?
      </p>
    ),
    labels: { confirm: 'Xóa', cancel: 'Không xóa' },
    confirmProps: { color: 'red' },
    onConfirm: () => {
      deleteByIdApi.mutate(entityId, {
        onSuccess: () => navigate('/admin/category'),
      });
    },
  });

  const entityDetailActionsFragment = (entity: CategoryResponse) => (
    <>
      <Link
        to={`/admin/product?categoryId=${entity.id}`}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Xem sản phẩm
      </Link>
      {entity.level < 2 && (
        <>
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={() => openDeleteModal(entity.id)}
          >
            Xóa
          </button>
          <Link
            to={`/admin/category/update/${entity.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors"
          >
            Sửa
          </Link>
          <Link
            to={`/admin/category/create?parentCategoryId=${entity.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
          >
            Thêm thể loại con
          </Link>
        </>
      )}
    </>
  );

  return (
    <Stack>
      <ManageHeader>
        <ManageHeaderTitle
          titleLinks={CategoryConfigs.manageTitleLinks}
          title={'Chi tiết thể loại'}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Quay lại
          </button>
        </div>
      </ManageHeader>

      <Paper shadow="xs" p="md">
        <EntityDetailTable
          entityDetailTableRowsFragment={entityDetailTableRowsFragment}
          entityDetailActionsFragment={entityDetailActionsFragment}
          resourceUrl={CategoryConfigs.resourceUrl}
          resourceKey={CategoryConfigs.resourceKey}
          entityId={entityId}
        />
      </Paper>
    </Stack>
  );
}

export default CategoryDetail;
