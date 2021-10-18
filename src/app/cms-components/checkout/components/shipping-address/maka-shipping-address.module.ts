import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  CardModule,
  SpinnerModule,
  CheckoutProgressMobileTopModule,
  CheckoutProgressMobileBottomModule,
  CartNotEmptyGuard,
  CheckoutDetailsLoadedGuard
} from '@spartacus/storefront';
import {
  I18nModule,
  CmsConfig,
  provideDefaultConfig
} from '@spartacus/core';

import { MakaShippingAddressComponent } from './maka-shipping-address.component';
import { MakaAddressFormModule } from './address-form/maka-address-form.module';
import { MakaCheckoutAuthGuard } from '../../guards/maka-checkout-auth.guard';
import { MakaCheckoutOrderSummaryModule } from '../checkout-order-summary/maka-checkout-order-summary.module';
import { MakaDeliveryModesModule } from './maka-delivery-modes/maka-delivery-modes.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    SpinnerModule,
    I18nModule,
    CheckoutProgressMobileTopModule,
    CheckoutProgressMobileBottomModule,
    MakaAddressFormModule,
    MakaCheckoutOrderSummaryModule,
    MakaDeliveryModesModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CheckoutShippingAddress: {
          component: MakaShippingAddressComponent,
          guards: [
            MakaCheckoutAuthGuard,
            CartNotEmptyGuard,
            CheckoutDetailsLoadedGuard,
          ],
        },
      },
    } as CmsConfig),
    CurrencyPipe
  ],
  declarations: [MakaShippingAddressComponent],
  entryComponents: [MakaShippingAddressComponent],
  exports: [MakaShippingAddressComponent]
})
export class MakaShippingAddressModule { }
