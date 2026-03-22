import React from 'react';
import { AB, DragDrop, Filter, Keyboard, PlaystationX } from 'tabler-icons-react';
import { EntityPropertyType, SelectOption } from 'types';
import FilterUtils, { FilterCriteria } from 'utils/FilterUtils';
import useFilterCriteriaRowViewModel from 'components/FilterCriteriaRow/FilterCriteriaRow.vm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FilterCriteriaRowProps {
  filterCriteria: FilterCriteria;
  index: number;
}

function FilterCriteriaRow({
  filterCriteria,
  index,
}: FilterCriteriaRowProps) {
  const {
    filterPropertySelectList,
    handleFilterPropertySelect,
    handleFilterOperatorSelect,
    handleFilterValueInput,
    handleDeleteFilterCriteriaButton,
  } = useFilterCriteriaRowViewModel();

  const isSelectedFilterProperty = filterCriteria.property && filterCriteria.type;

  const isDisabledFilterValueInput = !(isSelectedFilterProperty && filterCriteria.operator)
    || FilterUtils.filterOperatorIsNullAndIsNotNullList.includes(filterCriteria.operator);

  let filterOperatorSelectList: SelectOption[];
  let filterValueInputFragment;

  switch (filterCriteria.type) {
  case EntityPropertyType.STRING:
    filterOperatorSelectList = FilterUtils.filterStringOperatorSelectList;
    filterValueInputFragment = (
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Keyboard size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Nhập giá trị"
          value={filterCriteria.value || ''}
          onChange={(e) => handleFilterValueInput(e, index)}
          disabled={isDisabledFilterValueInput}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
    break;
  case EntityPropertyType.NUMBER:
    filterOperatorSelectList = FilterUtils.filterNumberOperatorSelectList;
    filterValueInputFragment = (
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Keyboard size={14} className="text-gray-400" />
        </div>
        <input
          type="number"
          placeholder="Nhập giá trị"
          value={filterCriteria.value ? Number(filterCriteria.value) : ''}
          onChange={(e) => handleFilterValueInput(Number(e.target.value) || 0, index)}
          disabled={isDisabledFilterValueInput}
          min={0}
          max={1_000_000_000}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
    break;
  case EntityPropertyType.DATE:
    filterOperatorSelectList = FilterUtils.filterDateOperatorSelectList;
    filterValueInputFragment = (
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Keyboard size={14} className="text-gray-400" />
        </div>
        <DatePicker
          selected={filterCriteria.value ? new Date(filterCriteria.value) : null}
          onChange={(date) => handleFilterValueInput(date ? date.toISOString() : '', index)}
          disabled={isDisabledFilterValueInput}
          dateFormat="dd/MM/yyyy"
          placeholderText="Nhập giá trị"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
    break;
  default:
    filterOperatorSelectList = [];
    filterValueInputFragment = (
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Keyboard size={14} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Nhập giá trị"
          disabled={isDisabledFilterValueInput}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-nowrap justify-between">
      <button
        type="button"
        title="Di chuyển tiêu chí lọc"
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <DragDrop size={18} />
      </button>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AB size={14} className="text-gray-400" />
        </div>
        <select
          value={filterCriteria.property || ''}
          onChange={(e) => handleFilterPropertySelect(e.target.value || null, index)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn thuộc tính</option>
          {filterPropertySelectList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter size={14} className="text-gray-400" />
        </div>
        <select
          value={filterCriteria.operator || ''}
          onChange={(e) => handleFilterOperatorSelect(e.target.value || null, index)}
          disabled={!isSelectedFilterProperty}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Chọn cách lọc</option>
          {filterOperatorSelectList.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {filterValueInputFragment}
      <button
        type="button"
        onClick={() => handleDeleteFilterCriteriaButton(index)}
        title="Xóa tiêu chí lọc"
        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <PlaystationX size={18} />
      </button>
    </div>
  );
}

export default FilterCriteriaRow;
