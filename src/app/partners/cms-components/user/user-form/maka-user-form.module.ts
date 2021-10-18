import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  UrlModule,
  I18nModule,
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPartnerUserFormComponent } from './maka-user-form.component';
import { MakaPartnerAddressFormModule } from '../address/maka-address-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
    MakaPartnerAddressFormModule,
  ],
  declarations: [MakaPartnerUserFormComponent],
  exports: [MakaPartnerUserFormComponent],
  entryComponents: [MakaPartnerUserFormComponent]
})
export class MakaPartnerUserFormModule { }
