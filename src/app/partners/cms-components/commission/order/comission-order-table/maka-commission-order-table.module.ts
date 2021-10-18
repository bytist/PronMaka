import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginationModule } from '@spartacus/storefront';
import { I18nModule, UrlModule } from '@spartacus/core';

import { MakaCommissionOrderTableComponent } from './maka-commission-order-table.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    PaginationModule,
    RouterModule,
    UrlModule
  ],
  declarations: [MakaCommissionOrderTableComponent],
  exports: [MakaCommissionOrderTableComponent],
  entryComponents: [MakaCommissionOrderTableComponent],
})
export class MakaCommissionOrderTableModule {
}
