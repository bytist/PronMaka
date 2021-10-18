import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CmsConfig, FeaturesConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import {
  OrderDetailsService,
  CartSharedModule,
  CardModule,
  PromotionsModule,
  SpinnerModule,
  IconModule
} from '@spartacus/storefront';

import { MakaOrderDetailShippingComponent } from './order-detail-shipping/maka-order-detail-shipping.component';
import { MakaOrderDetailHeadlineComponent } from './order-detail-headline/maka-order-detail-headline.component';
import { MakaOrderDetailItemsComponent } from './order-detail-items/maka-order-detail-items.component';
import { MakaOrderDetailsTotalsComponent } from './order-details-totals/maka-order-details-totals.component';
import { MakaOrderSummaryModule } from '../../../cart/cart-shared/order-summary/maka-order-summary.module';
import { MakaOrderConfirmationModule } from '../../../order-confirmation/maka-order-confirmation.module';
import { MakaOrderDetailRecurrentOrderDetailsComponent } from './order-detail-recurrent-order-details/maka-order-detail-recurrent-order-details.component';
import { MakaCancelOrderRecurrenceModalComponent } from './cancel-order-recurrence-modal/maka-cancel-order-recurrence-modal.component';

@NgModule({
  imports: [
    CartSharedModule,
    CardModule,
    CommonModule,
    I18nModule,
    FeaturesConfigModule,
    PromotionsModule,
    UrlModule,
    SpinnerModule,
    MakaOrderSummaryModule,
    MakaOrderConfirmationModule,
    IconModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AccountOrderDetailsShippingComponent: {
          component: MakaOrderDetailShippingComponent
        },
        AccountOrderDetailsHeadlineComponent: {
          component: MakaOrderDetailHeadlineComponent,
        },
        AccountOrderDetailsItemsComponent: {
          component: MakaOrderDetailItemsComponent,
        },
        AccountOrderDetailsTotalsComponent: {
          component: MakaOrderDetailsTotalsComponent,
        },
        AccountOrderDetailsRecurrentOrderDetailsComponent: {
          component: MakaOrderDetailRecurrentOrderDetailsComponent
        },
      }
    } as CmsConfig | FeaturesConfig),
    OrderDetailsService,
  ],
  declarations: [
    MakaOrderDetailShippingComponent,
    MakaOrderDetailHeadlineComponent,
    MakaOrderDetailItemsComponent,
    MakaOrderDetailsTotalsComponent,
    MakaOrderDetailRecurrentOrderDetailsComponent,
    MakaCancelOrderRecurrenceModalComponent
  ],
  entryComponents: [ MakaOrderDetailShippingComponent ],
})
export class MakaOrderDetailsModule {}
