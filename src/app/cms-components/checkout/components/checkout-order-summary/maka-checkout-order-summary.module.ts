import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { MakaCheckoutOrderSummaryComponent } from './maka-checkout-order-summary.component';
import { MakaOrderSummaryModule } from '../../../cart/cart-shared/order-summary/maka-order-summary.module';
import { MakaPlaceOrderModule } from '../place-order/maka-place-order.module';

@NgModule({
  imports: [CommonModule, MakaOrderSummaryModule, MakaPlaceOrderModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CheckoutOrderSummary: {
          component: MakaCheckoutOrderSummaryComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCheckoutOrderSummaryComponent],
  entryComponents: [MakaCheckoutOrderSummaryComponent],
  exports: [MakaCheckoutOrderSummaryComponent],
})
export class MakaCheckoutOrderSummaryModule {}
