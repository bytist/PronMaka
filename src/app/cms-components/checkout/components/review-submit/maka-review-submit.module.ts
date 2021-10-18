import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardModule,
  CartNotEmptyGuard,
  CartSharedModule,
  DeliveryModeSetGuard,
  PromotionsModule,
  ShippingAddressSetGuard
} from '@spartacus/storefront';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';

import { MakaReviewSubmitComponent } from './maka-review-submit.component';
import { MakaCheckoutAuthGuard } from '../../guards/maka-checkout-auth.guard';
import { MakaCheckoutOrderSummaryModule } from '../checkout-order-summary/maka-checkout-order-summary.module';
import { MakaPaymentDetailsSetGuard } from '../../guards/maka-payment-details-set.guard';


@NgModule({
  imports: [
    CommonModule,
    CardModule,
    CartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    FeaturesConfigModule,
    MakaCheckoutOrderSummaryModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CheckoutReviewOrder: {
          component: MakaReviewSubmitComponent,
          guards: [
            MakaCheckoutAuthGuard,
            CartNotEmptyGuard,
            ShippingAddressSetGuard,
            DeliveryModeSetGuard,
            MakaPaymentDetailsSetGuard,
          ],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaReviewSubmitComponent],
  exports: [MakaReviewSubmitComponent],
  entryComponents: [MakaReviewSubmitComponent]
})
export class MakaReviewSubmitModule {
}
