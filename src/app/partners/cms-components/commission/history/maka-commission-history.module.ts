import { NgModule } from '@angular/core';
import { AuthGuard, CmsConfig, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MakaCommissionHistoryComponent } from './maka-commission-history.component';
import { MakaSpinnerModule } from '../../../../cms-components/misc/maka-spinner/maka-spinner.module';

@NgModule({
    imports: [
        CommonModule,
        I18nModule,
        PaginationModule,
        NgSelectModule,
        FormsModule,
        RouterModule,
        UrlModule,
        MakaSpinnerModule
    ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CommissionHistoryComponent: {
          component: MakaCommissionHistoryComponent,
          guards: [AuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCommissionHistoryComponent],
  exports: [MakaCommissionHistoryComponent],
  entryComponents: [MakaCommissionHistoryComponent]
})
export class MakaCommissionHistoryModule { }
