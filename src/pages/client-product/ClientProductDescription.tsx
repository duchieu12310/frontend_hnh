import { Receipt } from 'tabler-icons-react';
import React from 'react';
import { ClientProductResponse } from 'types';

interface ClientProductDescriptionProps {
  product: ClientProductResponse;
}

function ClientProductDescription({ product }: ClientProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Receipt size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mô tả sản phẩm</h2>
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{product.productDescription}</p>
    </div>
  );
}

export default ClientProductDescription;
