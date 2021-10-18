import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@spartacus/core';
import { SpinnerModule } from '@spartacus/storefront';

import { MakaSpinnerComponent } from './maka-spinner.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    SpinnerModule
  ],
  declarations: [MakaSpinnerComponent],
  exports: [MakaSpinnerComponent],
  entryComponents: [MakaSpinnerComponent]
})
export class MakaSpinnerModule { }
