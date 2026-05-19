import isEqual from 'lodash.isequal';
import { ClientCategoryResponse } from 'types';

class MiscUtils {
  static pick = <T>(o: T, arr: string[]) => {
    const result = {};

    // @ts-ignore
    Object.entries(o).forEach(([k, v]) => {
      if (arr.includes(k)) {
        Object.assign(result, { [k]: v });
      }
    });

    return result;
  };

  static isEquals = <T1, T2>(first: T1, second: T2) => isEqual(first, second);

  static convertToSlug = (name: string) => name.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/ /g, '-')
    .concat('-', Math.random().toString(36).substring(2, 7));

  static formatPrice = (price: number): string => new Intl.NumberFormat('vi-VN').format(price);

  static recursiveFlatMap = (arrays: string[][], i = 0, combination: string[] = []): string[][] => {
    if (i === arrays.length) {
      return [combination];
    }
    return arrays[i].flatMap(n => MiscUtils.recursiveFlatMap(arrays, i + 1, [...combination, n]));
  };

  static parserPrice = (value?: string) => (value || '').replace(/(\.)/g, '');

  static formatterPrice = (value?: string) => !Number.isNaN(parseFloat(value || ''))
    ? (value || '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : '';

  static makeCategoryBreadcrumbs = (category: ClientCategoryResponse): ClientCategoryResponse[] => {
    if (!category.categoryParent) {
      return [category];
    }
    return [...MiscUtils.makeCategoryBreadcrumbs(category.categoryParent), category];
  };

  static generatePriceOptions = (filterPriceQuartiles: [number, number]) => {
    // Return standard price tiers appropriate for books
    return [
      ['0', '50000'],
      ['50000', '150000'],
      ['150000', '300000'],
      ['300000', '500000'],
      ['500000', 'max']
    ];
  };

  static readablePriceOption = (priceOption: string[]) => {
    const formatPrice = (priceStr: string) => {
      const price = parseInt(priceStr, 10);
      if (price >= 1000000) {
        return (price / 1000000) + ' tr';
      } else if (price >= 1000) {
        return (price / 1000) + 'k';
      }
      return priceStr;
    };

    if (priceOption[0] === '0') {
      return 'Dưới ' + formatPrice(priceOption[1]);
    } else if (priceOption[1] === 'max') {
      return 'Trên ' + formatPrice(priceOption[0]);
    }

    return formatPrice(priceOption[0]) + ' đến ' + formatPrice(priceOption[1]);
  };

  // eslint-disable-next-line no-console
  static console = console;

  static ghnLogoPath = 'https://file.hstatic.net/200000472237/file/logo_b8515d08a6d14b09bce4e39221712e15.png';

  static calculateDiscountedPrice = (price: number, discount: number) => price * (100 - discount) / 100;
}

export default MiscUtils;
