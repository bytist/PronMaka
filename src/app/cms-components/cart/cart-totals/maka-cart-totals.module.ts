import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';

import { MakaCartTotalsComponent } from './maka-cart-totals.component';
import { MakaOrderSummaryModule } from '../cart-shared/order-summary/maka-order-summary.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    MakaOrderSummaryModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CartTotalsComponent: {
          component: MakaCartTotalsComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCartTotalsComponent],
  exports: [MakaCartTotalsComponent],
  entryComponents: [MakaCartTotalsComponent],
})
export class MakaCartTotalsModule {}
