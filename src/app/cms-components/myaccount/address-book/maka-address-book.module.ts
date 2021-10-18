import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AddressBookComponentService,
  AddressFormModule,
  CardModule,
  SpinnerModule
} from '@spartacus/storefront';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UserAddressService
} from '@spartacus/core';

import { MakaAddressBookComponent } from './maka-address-book.component';
import { MakaAddressFormModule } from '../../checkout/components/shipping-address/address-form/maka-address-form.module';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    AddressFormModule,
    SpinnerModule,
    I18nModule,
    MakaAddressFormModule
  ],
  declarations: [ MakaAddressBookComponent ],
  exports: [ MakaAddressBookComponent ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AccountAddressBookComponent: {
          component: MakaAddressBookComponent,
          providers: [
            {
              provide: AddressBookComponentService,
              useClass: AddressBookComponentService,
              deps: [ UserAddressService ],
            },
          ],
          guards: [ AuthGuard ]
        }
      }
    } as CmsConfig),
    UserAddressService
  ]
})
export class MakaAddressBookModule { }
