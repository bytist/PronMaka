import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule, IconModule } from '@spartacus/storefront';

import { MakaCheckoutOrderSummaryModule } from '../../checkout-order-summary/maka-checkout-order-summary.module';
import { MakaAddressFormComponent } from './maka-address-form.component';
import { MakaDeliveryModesModule } from '../maka-delivery-modes/maka-delivery-modes.module';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    IconModule,
    I18nModule,
    FormErrorsModule,
    MakaCheckoutOrderSummaryModule,
    MakaDeliveryModesModule
  ],
  declarations: [ MakaAddressFormComponent ],
  exports: [ MakaAddressFormComponent ]
})
export class MakaAddressFormModule { }
