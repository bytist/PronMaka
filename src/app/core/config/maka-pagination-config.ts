import { PaginationConfig } from '@spartacus/storefront';

export const makaPaginationConfig: PaginationConfig = {
  pagination: {
    addStart: false,
    addEnd: false,
    addPrevious: true,
    addNext: true,
    previousLabel: '<',
    nextLabel: '>'
  },
} as PaginationConfig;
