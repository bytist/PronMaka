import {
  User,
  UserSignUp
} from '@spartacus/core';

import { MakaAddress } from './maka-address.model';

export interface MakaUser extends User {
  associateId?: string;
  isAssociate?: boolean;
}

export interface MakaPartner extends MakaUser {
  password?: string;
  rfc?: string;
  legalEntityName?: string;
  contactAddress?: MakaAddress; // @TODO - check if we can remove this attribute when implementing MAKA-245
  address?: MakaAddress;
  cellphone?: string;
  supplierIdERP?: string;
  associateStatus?: AssociateStatus;
}

export interface MakaUserSignUp extends UserSignUp {
  associateId?: string;
}

export enum AssociateStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PRE_REGISTERED = 'PRE_REGISTERED'
}

export interface MakaUsersPerDay {
  users: number;
  dayOfMonth: number;
}

export interface MakaCommissionLevel {
  description: string;
  minActiveClientsCondition: string;
  rate: string;
}

export interface MakaUsersPerDayList {
  commissionLevels: MakaCommissionLevel[];
  usersPerDayList: MakaUsersPerDay[];
}

