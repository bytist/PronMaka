import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  UrlModule,
  I18nModule,
  provideDefaultConfig,
  CmsConfig
} from '@spartacus/core';
import {
  CartNotEmptyGuard,
  SpinnerModule
} from '@spartacus/storefront';

import { MakaPlacingOrderComponent } from './maka-placing-order.component';
import { MakaPlacingOrderAuthGuard } from '../../guards/maka-placing-order-auth.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    UrlModule,
    I18nModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        MakaPlacingOrderComponent: {
          component: MakaPlacingOrderComponent,
          guards: [MakaPlacingOrderAuthGuard, CartNotEmptyGuard]
        }
      },
    } as CmsConfig),
  ],
  declarations: [MakaPlacingOrderComponent],
  entryComponents: [MakaPlacingOrderComponent],
  exports: [MakaPlacingOrderComponent]
})
export class MakaPlacingOrderModule { }
