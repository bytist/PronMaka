import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  CardModule,
  IconModule,
  SpinnerModule,
  FormErrorsModule
} from '@spartacus/storefront';
import { I18nModule } from '@spartacus/core';

import { MakaPaymentFormComponent } from './maka-payment-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    CardModule,
    I18nModule,
    IconModule,
    SpinnerModule,
    FormErrorsModule,
  ],
    declarations: [MakaPaymentFormComponent],
    entryComponents: [MakaPaymentFormComponent],
    exports: [MakaPaymentFormComponent],
  })
  export class MakaPaymentFormModule {}
