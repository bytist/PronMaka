import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPartnerFormComponent } from './maka-partner-form.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    I18nModule,
    FormErrorsModule,
  ],
  declarations: [ MakaPartnerFormComponent ],
  exports: [ MakaPartnerFormComponent ]
})
export class MakaPartnerFormModule { }
