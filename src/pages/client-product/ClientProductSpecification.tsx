import { Apps } from 'tabler-icons-react';
import React from 'react';
import { ClientProductResponse } from 'types';

interface ClientProductSpecificationProps {
  product: ClientProductResponse;
}

function ClientProductSpecification({ product }: ClientProductSpecificationProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Apps size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thông số sản phẩm</h2>
      </div>
      <div className="border border-gray-300 dark:border-gray-600 rounded-md md:w-[500px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">Thông số</th>
              <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {product.productSpecifications?.content?.map(specification => (
              <tr key={specification.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-3 text-gray-700 dark:text-gray-300">{specification.name}</td>
                <td className="p-3 text-gray-900 dark:text-gray-100">{specification.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientProductSpecification;
