import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard, CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';

import { MakaCommissionPaymentComponent } from './maka-commission-payment.component';
import { MakaAccessSiteGuard } from '../../../../core/guards/access-site/maka-access-site.guard';
import { MakaSpinnerModule } from '../../../../cms-components/misc/maka-spinner/maka-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    MakaSpinnerModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CommissionPaymentComponent: {
          component: MakaCommissionPaymentComponent,
          disableSSR: false,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCommissionPaymentComponent],
  exports: [MakaCommissionPaymentComponent],
  entryComponents: [MakaCommissionPaymentComponent]
})
export class MakaCommissionPaymentModule { }
