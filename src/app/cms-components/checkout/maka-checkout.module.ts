import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ConfigModule, CmsConfig } from '@spartacus/core';
import { CartNotEmptyGuard, CheckoutGuard } from '@spartacus/storefront';

import { MakaCheckoutAuthGuard } from './guards/maka-checkout-auth.guard';
import { MakaPaymentMethodModule } from './components/payment-method/maka-payment-method.module';
import { MakaReviewSubmitModule } from './components/review-submit/maka-review-submit.module';
import { MakaShippingAddressModule } from './components/shipping-address/maka-shipping-address.module';
import { MakaPlaceOrderModule } from './components/place-order/maka-place-order.module';
import { MakaCheckoutEffects } from 'src/app/core/checkout/store/effects/maka-checkout.effects';
import { MakaCheckoutOrderSummaryModule } from './components/checkout-order-summary/maka-checkout-order-summary.module';

@NgModule({
  imports: [
    EffectsModule.forFeature([MakaCheckoutEffects]),
    MakaPaymentMethodModule,
    MakaReviewSubmitModule,
    MakaShippingAddressModule,
    MakaPlaceOrderModule,
    MakaCheckoutOrderSummaryModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CheckoutOrchestrator: {
          guards: [MakaCheckoutAuthGuard, CartNotEmptyGuard, CheckoutGuard],
        },
        CheckoutProgress: {
          guards: [MakaCheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    } as CmsConfig),
  ],
  exports: [
    MakaPaymentMethodModule,
    MakaReviewSubmitModule,
    MakaShippingAddressModule,
    MakaPlaceOrderModule
  ],
})
export class MakaCheckoutModule { }
