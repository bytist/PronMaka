import { Price } from '@spartacus/core';
import { Principal } from '@spartacus/core/src/model/cart.model';

import { PaginationModel } from '@spartacus/core/src/model/misc.model';

export interface AssociateDashboardCommissionOrder {
  code: string;
  date: Date;
  user: Principal;
  total: Price;
}

export interface AssociateDashboardCommissionOrders {
  orders: AssociateDashboardCommissionOrder[];
  pagination: PaginationModel;
}
