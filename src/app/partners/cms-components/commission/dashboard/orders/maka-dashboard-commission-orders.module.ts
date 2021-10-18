import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { PaginationModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';

import { MakaDashboardCommissionOrdersComponent } from './maka-dashboard-commission-orders.component';
import { MakaCommissionOrderTableModule } from '../../order/comission-order-table/maka-commission-order-table.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    PaginationModule,
    NgSelectModule,
    MakaCommissionOrderTableModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CommissionReferralOrdersComponent: {
          component: MakaDashboardCommissionOrdersComponent,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaDashboardCommissionOrdersComponent],
  exports: [MakaDashboardCommissionOrdersComponent],
  entryComponents: [MakaDashboardCommissionOrdersComponent]
})
export class MakaDashboardCommissionOrdersModule {
}
