import { NgModule } from '@angular/core';
import { CheckoutPaymentAdapter } from '@spartacus/core';

import { MakaCheckoutPaymentAdapter } from './maka-checkout-payment.adapter';

@NgModule({
  providers: [
    {
      provide: CheckoutPaymentAdapter,
      useClass: MakaCheckoutPaymentAdapter
    }
  ]
})
export class MakaCheckoutPaymentModule { }
