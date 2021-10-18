import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { CartNotEmptyGuard, FormErrorsModule } from '@spartacus/storefront';
import { ReactiveFormsModule } from '@angular/forms';

import { MakaPlaceOrderComponent } from './maka-place-order.component';
import { MakaPaypalModule } from '../payment-method/maka-paypal/maka-paypal.module';
import { MakaSpinnerModule } from '../../../misc/maka-spinner/maka-spinner.module';
import { MakaCheckoutAuthGuard } from '../../guards/maka-checkout-auth.guard';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    MakaPaypalModule,
    ReactiveFormsModule,
    FormErrorsModule,
    MakaSpinnerModule
  ],
  providers:
    [
      provideDefaultConfig({
        cmsComponents: {
          CheckoutPlaceOrder: {
            component: MakaPlaceOrderComponent,
            guards: [MakaCheckoutAuthGuard, CartNotEmptyGuard],
          },
        },
      } as CmsConfig),
    ],
  declarations: [MakaPlaceOrderComponent],
  entryComponents: [MakaPlaceOrderComponent],
  exports: [MakaPlaceOrderComponent],
})

export class MakaPlaceOrderModule {}
