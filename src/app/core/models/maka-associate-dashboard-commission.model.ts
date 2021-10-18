import {
  Price
} from '@spartacus/core';

export interface AssociateDashboardCommissionAccount {
  firstName: string;
  lastName: string;
  email: string;
  supplierIdERP: string;
}

export interface AssociateDashboardCommissionLevel {
  rate: string;
  description?: string;
}

export interface AssociateDashboardActualCommissionLevel {
  commission: AssociateDashboardCommissionLevel;
  totalActiveClients: number;
}

export interface AssociateDashboardNextCommissionLevel {
  commission: AssociateDashboardCommissionLevel;
  incentiveMessage: string;
}

export interface AssociateDashboardCommissionInfo {
  actualCommissionLevel: AssociateDashboardActualCommissionLevel;
  nextCommissionLevel?: AssociateDashboardNextCommissionLevel;
  cutOffDate: Date;
  dueDate: Date;
  referMoreIncentiveMessageTitle?: string;
  referMoreIncentiveMessageSubtitle?: string;
  total: Price;
}

export interface AssociateDashboardCommission {
  associate: AssociateDashboardCommissionAccount;
  commissionInfo: AssociateDashboardCommissionInfo;
}

