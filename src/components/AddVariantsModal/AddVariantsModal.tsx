import React, { useState } from 'react';

interface AddVariantsModalProps {
  remainingPropertyValueCombinations: string[][];
  handleAddVariantsButton: (
    selectedRemainingPropertyValueCombinationIndexes: number[]
  ) => void;
}

function AddVariantsModal({
  remainingPropertyValueCombinations,
  handleAddVariantsButton,
}: AddVariantsModalProps) {
  const [
    selectedRemainingPropertyValueCombinationIndexes,
    setSelectedRemainingPropertyValueCombinationIndexes,
  ] = useState<number[]>([]);

  const handleRemainingPropertyValueCombinationCheckbox = (index: number) => {
    setSelectedRemainingPropertyValueCombinationIndexes((indexes) =>
      indexes.includes(index)
        ? indexes.filter((i) => i !== index)
        : [...indexes, index]
    );
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {remainingPropertyValueCombinations.map((combination, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedRemainingPropertyValueCombinationIndexes.includes(index)}
              onChange={() => handleRemainingPropertyValueCombinationCheckbox(index)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{combination.join(' ⋅ ')}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          handleAddVariantsButton(
            selectedRemainingPropertyValueCombinationIndexes
          )
        }
        disabled={selectedRemainingPropertyValueCombinationIndexes.length === 0}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Thêm
      </button>
    </>
  );
}

export default AddVariantsModal;
