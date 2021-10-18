import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideDefaultConfig, UserService } from '@spartacus/core';
import {
  CardModule,
  CartNotEmptyGuard,
  DeliveryModeSetGuard, FormErrorsModule,
  PaymentFormModule,
  ShippingAddressSetGuard,
  SpinnerModule,
  ɵw as ProductVariantsModule
} from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';

import { MakaPaymentFormModule } from './maka-payment-form/maka-payment-form.module';
import { MakaPaymentMethodComponent } from './maka-payment-method.component';
import { MakaCheckoutAuthGuard } from '../../guards/maka-checkout-auth.guard';
import { MakaOpenpayComponent } from './maka-openpay/maka-openpay.component';
import { MakaBillingFormComponent } from './maka-billing-form/maka-billing-form.component';
import { MakaCheckoutOrderSummaryModule } from '../checkout-order-summary/maka-checkout-order-summary.module';
import { MakaPaypalModule } from './maka-paypal/maka-paypal.module';
import { MakaPartnerFormModule } from '../partner-form/maka-partner-form.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaymentFormModule,
    CardModule,
    SpinnerModule,
    I18nModule,
    MakaPaymentFormModule,
    ReactiveFormsModule,
    ProductVariantsModule,
    FormErrorsModule,
    NgSelectModule,
    MakaPaypalModule,
    MakaCheckoutOrderSummaryModule,
    MakaPartnerFormModule
  ],
  providers: [
    UserService,
    provideDefaultConfig({
      cmsComponents: {
        CheckoutPaymentDetails: {
          component: MakaPaymentMethodComponent,
          guards: [
            MakaCheckoutAuthGuard,
            CartNotEmptyGuard,
            ShippingAddressSetGuard,
            DeliveryModeSetGuard
          ],
        },
      },
    } as CmsConfig)],
  declarations: [
    MakaPaymentMethodComponent,
    MakaOpenpayComponent,
    MakaBillingFormComponent,
  ],
  entryComponents: [MakaPaymentMethodComponent],
  exports: [MakaPaymentMethodComponent, MakaBillingFormComponent],
})
export class MakaPaymentMethodModule {
}

