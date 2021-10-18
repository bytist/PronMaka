import {
    Cart,
    PaymentDetails
} from '@spartacus/core';
import { MakaAddress } from './maka-address.model';
import { PaymentMode } from './maka-payment.model';

export enum RecurrenceOrderStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED'
}

export interface MakaRecurrenceConfiguration {
    code?: string;
    description?: string;
    nextExecutionDate?: string;
    status?: RecurrenceOrderStatus;
}

export interface MakaCart extends Cart {
    recurringOrder?: boolean;
    recurrence?: MakaRecurrenceConfiguration;
    recurrenceConfigurations?: MakaRecurrenceConfiguration[];
    paymentAddress?: MakaAddress;
    associateId?: string;
    paymentMode?: PaymentMode;
}

export interface MakaPaymentDetails extends PaymentDetails {
    openPayDeviceId?: string;
    openPayTokenId?: string;
}
