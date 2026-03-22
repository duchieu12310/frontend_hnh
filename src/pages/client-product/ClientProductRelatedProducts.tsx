import { CircleSquare } from 'tabler-icons-react';
import { ClientProductCard } from 'components';
import React from 'react';
import { ClientProductResponse } from 'types';

interface ClientProductRelatedProductsProps {
  product: ClientProductResponse;
}

function ClientProductRelatedProducts({ product }: ClientProductRelatedProductsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CircleSquare size={24} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sách liên quan</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {product.productRelatedProducts.map((product, index) => (
          <div key={index}>
            <ClientProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientProductRelatedProducts;
