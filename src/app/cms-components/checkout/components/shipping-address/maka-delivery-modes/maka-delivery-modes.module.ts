import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { SpinnerModule } from '@spartacus/storefront';

import { MakaDeliveryModesComponent } from './maka-delivery-modes.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, I18nModule, SpinnerModule],
  declarations: [MakaDeliveryModesComponent],
  entryComponents: [MakaDeliveryModesComponent],
  exports: [MakaDeliveryModesComponent],
})
export class MakaDeliveryModesModule {}
