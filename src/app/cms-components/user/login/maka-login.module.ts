import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import { PageSlotModule, PageLayoutModule, OutletRefModule } from '@spartacus/storefront';

import { MakaLoginComponent } from './maka-login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    PageSlotModule,
    I18nModule,
    PageLayoutModule,
    OutletRefModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        LoginComponent: {
          component: MakaLoginComponent,
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaLoginComponent],
  entryComponents: [MakaLoginComponent],
  exports: [MakaLoginComponent],
})
export class MakaLoginModule {}
