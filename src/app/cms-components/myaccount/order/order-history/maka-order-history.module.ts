import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  I18nModule,
  UrlModule,
  AuthGuard,
  provideDefaultConfig,
  CmsConfig
} from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ListNavigationModule,
  CmsPageGuard,
  PageLayoutComponent,
  SpinnerModule
} from '@spartacus/storefront';

import { MakaOrderHistoryComponent } from './maka-order-history.component';
import { MakaModelTransformersModule } from 'src/app/core/models/maka-model-transformers/maka-model-transformers.module';
import { MakaOrderHistoryTableComponent } from './order-history-table/maka-order-history-table.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    SpinnerModule,
    RouterModule.forChild([
      {
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'orders' },
      },
    ]),
    MakaModelTransformersModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AccountOrderHistoryComponent: {
          component: MakaOrderHistoryComponent,
          guards: [AuthGuard],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaOrderHistoryComponent, MakaOrderHistoryTableComponent],
  exports: [MakaOrderHistoryComponent],
  entryComponents: [MakaOrderHistoryComponent]
})
export class MakaOrderHistoryModule { }
