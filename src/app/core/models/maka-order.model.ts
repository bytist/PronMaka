import {
    OrderHistory,
    Order
} from '@spartacus/core';
import { MakaRecurrenceConfiguration } from './maka-cart.model';
import { MakaAddress } from './maka-address.model';
import { PaymentMode } from './maka-payment.model';

export interface MakaOrderHistory extends OrderHistory {
    petName?: string;
    recurrence?: MakaRecurrenceConfiguration;
}

export interface MakaOrder extends Order {
    paymentAddress?: MakaAddress;
    paymentMode?: PaymentMode;
    openPay3DSTransactionId?: string;
    openPay3DSTransactionUrl?: string;
    carrierTrackingNumber?: string;
    carrierUrl?: string;
    recurrence?: MakaRecurrenceConfiguration;
}

export interface MakaOrderHistorySearch {
    sortCode: string;
    currentPage: number;
    recurrentOrders: boolean;
}
