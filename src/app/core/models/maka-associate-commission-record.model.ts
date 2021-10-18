import { Price } from '@spartacus/core';

export interface CommissionStatus {
  code: string;
  name?: string;
}

export interface AssociateCommissionRecord {
  code: string;
  status: CommissionStatus;
  totalOrders: number;
  total: Price;
  ordersTotalPriceNet: Price;
  commissionLevelApplied: string;
  activeClients: number;
  dueDate: string;
  cutOffDate: string;
}
