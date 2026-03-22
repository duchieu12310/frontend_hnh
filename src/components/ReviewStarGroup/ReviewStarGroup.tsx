import { Star } from 'tabler-icons-react';
import React from 'react';

function ReviewStarGroup({ ratingScore }: { ratingScore: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array(5).fill(0).map((_, index) => (
        <Star
          key={index}
          color={index < ratingScore ? '#eab308' : '#6b7280'}
          fill={index < ratingScore ? '#eab308' : '#6b7280'}
          size={14}
        />
      ))}
    </div>
  );
}

export default ReviewStarGroup;
