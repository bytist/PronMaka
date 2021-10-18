import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  I18nModule
} from '@spartacus/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPartnerAddressFormComponent } from './maka-address-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgSelectModule,
    I18nModule,
    FormErrorsModule
  ],
  declarations: [MakaPartnerAddressFormComponent],
  exports: [MakaPartnerAddressFormComponent],
  entryComponents: [MakaPartnerAddressFormComponent]
})
export class MakaPartnerAddressFormModule { }
