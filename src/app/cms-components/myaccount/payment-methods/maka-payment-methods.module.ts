import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { CardModule, SpinnerModule } from '@spartacus/storefront';

import { MakaPaymentMethodsComponent } from './maka-payment-methods.component';

@NgModule({
  imports: [CommonModule, CardModule, SpinnerModule, I18nModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AccountPaymentDetailsComponent: {
          component: MakaPaymentMethodsComponent,
          guards: [AuthGuard],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaPaymentMethodsComponent],
  exports: [MakaPaymentMethodsComponent],
  entryComponents: [MakaPaymentMethodsComponent],
})
export class MakaPaymentMethodsModule {}
