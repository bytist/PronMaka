import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  I18nModule,
  FeaturesConfigModule,
  UrlModule,
  CmsConfig,
  provideDefaultConfig
} from '@spartacus/core';
import {
  CartSharedModule,
  CartCouponModule,
  PromotionsModule
} from '@spartacus/storefront';
import { RouterModule } from '@angular/router';

import { MakaCartDetailsComponent } from './maka-cart-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CartSharedModule,
    CartCouponModule,
    RouterModule,
    UrlModule,
    PromotionsModule,
    FeaturesConfigModule,
    I18nModule,
    NgSelectModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CartComponent: {
          component: MakaCartDetailsComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCartDetailsComponent],
  exports: [MakaCartDetailsComponent],
  entryComponents: [MakaCartDetailsComponent]
})
export class MakaCartDetailsModule { }
