import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CartSharedModule,
  CardModule,
  PwaModule,
  PromotionsModule,
  FormErrorsModule
} from '@spartacus/storefront';
import {
  I18nModule,
  FeaturesConfigModule,
  CmsConfig,
  provideDefaultConfig
} from '@spartacus/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderConfirmationGuard } from './guards';

import {
  MakaOrderConfirmationOverviewComponent
} from './components/order-confirmation-overview/maka-order-confirmation-overview.component';
import { MakaOrderConfirmationThankYouMessageComponent } from './components/order-confirmation-thank-you-message/maka-order-confirmation-thank-you-message.component';
import { MakaOrderConfirmationItemsComponent } from './components/order-confirmation-items/maka-order-confirmation-items.component';
import { MakaOrderConfirmationTotalsComponent } from './components/order-confirmation-totals/maka-order-confirmation-totals.component';
import { MakaOrderConfirmationSummaryComponent } from './components/order-confirmation-summary/maka-order-confirmation-summary.component';
import { MakaOrderSummaryModule } from '../cart/cart-shared/order-summary/maka-order-summary.module';
import { MakaOrderOverviewComponent } from './components/shared/order-overview/maka-order-overview.component';

@NgModule({
  imports: [
    CommonModule,
    CartSharedModule,
    CardModule,
    PwaModule,
    PromotionsModule,
    I18nModule,
    ReactiveFormsModule,
    FeaturesConfigModule,
    FormErrorsModule,
    MakaOrderSummaryModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        OrderConfirmationThankMessageComponent: {
          component: MakaOrderConfirmationThankYouMessageComponent,
          guards: [OrderConfirmationGuard],
        },
        OrderConfirmationItemsComponent: {
          component: MakaOrderConfirmationItemsComponent,
          guards: [OrderConfirmationGuard],
        },
        OrderConfirmationTotalsComponent: {
          component: MakaOrderConfirmationTotalsComponent,
          guards: [OrderConfirmationGuard],
        },
        OrderConfirmationOverviewComponent: {
          component: MakaOrderConfirmationOverviewComponent,
          guards: [OrderConfirmationGuard],
        },
      }
    } as CmsConfig),
  ],
  declarations: [
    MakaOrderConfirmationOverviewComponent,
    MakaOrderConfirmationThankYouMessageComponent,
    MakaOrderConfirmationItemsComponent,
    MakaOrderConfirmationTotalsComponent,
    MakaOrderConfirmationSummaryComponent,
    MakaOrderOverviewComponent,
  ],
  exports: [MakaOrderOverviewComponent],
  entryComponents: [MakaOrderConfirmationOverviewComponent]
})
export class MakaOrderConfirmationModule { }
