import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { ItemCounterModule, MediaModule, PromotionsModule, CartCouponModule } from '@spartacus/storefront';
import { MakaOrderSummaryComponent } from './maka-order-summary.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CartCouponModule,
    ReactiveFormsModule,
    UrlModule,
    NgbModule,
    PromotionsModule,
    I18nModule,
    MediaModule,
    ItemCounterModule,
    FeaturesConfigModule,
  ],
  declarations: [
    MakaOrderSummaryComponent
  ],
  exports: [MakaOrderSummaryComponent],
})
export class MakaOrderSummaryModule {}
