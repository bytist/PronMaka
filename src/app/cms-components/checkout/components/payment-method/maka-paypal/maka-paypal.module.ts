import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SpinnerModule,
} from '@spartacus/storefront';


import { MakaPaypalComponent } from './maka-paypal.component';

@NgModule({
  imports: [
    CommonModule,
    SpinnerModule,
  ],
  declarations: [MakaPaypalComponent],
  exports: [MakaPaypalComponent],
})
export class MakaPaypalModule {}
