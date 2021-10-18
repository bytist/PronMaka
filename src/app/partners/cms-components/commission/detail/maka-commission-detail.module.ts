import { NgModule } from '@angular/core';
import { AuthGuard, CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CmsPageGuard, PageLayoutComponent } from '@spartacus/storefront';

import { MakaCommissionDetailComponent } from './maka-commission-detail.component';
import { MakaCommissionDetailOrdersComponent } from './order/maka-commission-detail-orders.component';
import { MakaCommissionOrderTableModule } from '../order/comission-order-table/maka-commission-order-table.module';
import { MakaSpinnerModule } from '../../../../cms-components/misc/maka-spinner/maka-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MakaSpinnerModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: {cxRoute: 'commissionDetails'},
      }
    ]),
    MakaCommissionOrderTableModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CommissionDetailComponent: {
          component: MakaCommissionDetailComponent,
          guards: [AuthGuard]
        },
        CommissionDetailsOrdersComponent: {
          component: MakaCommissionDetailOrdersComponent,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCommissionDetailComponent, MakaCommissionDetailOrdersComponent],
  exports: [MakaCommissionDetailComponent, MakaCommissionDetailOrdersComponent],
  entryComponents: [MakaCommissionDetailComponent, MakaCommissionDetailOrdersComponent]
})
export class MakaCommissionDetailModule {
}
