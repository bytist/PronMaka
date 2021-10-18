import { NgModule } from '@angular/core';

import { MakaUpdateProfileModule } from './update-profile/maka-update-profile.module';
import { MakaAddressBookModule } from './address-book/maka-address-book.module';
import { MakaUpdatePasswordModule } from './update-password/maka-update-password.module';
import { MakaPaymentMethodsModule } from './payment-methods/maka-payment-methods.module';

@NgModule({
  imports: [
    MakaUpdateProfileModule,
    MakaAddressBookModule,
    MakaUpdatePasswordModule,
    MakaPaymentMethodsModule
  ],
  exports: [
    MakaUpdateProfileModule,
    MakaAddressBookModule,
    MakaUpdatePasswordModule,
    MakaPaymentMethodsModule
  ],
})
export class MakaMyAccountModule { }
