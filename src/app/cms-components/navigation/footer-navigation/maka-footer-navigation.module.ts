import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { NavigationModule, GenericLinkModule } from '@spartacus/storefront';

import { MakaFooterNavigationComponent } from './maka-footer-navigation.component';
import { MakaAccessSiteGuard } from '../../../core/guards/access-site/maka-access-site.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NavigationModule,
    GenericLinkModule,
    I18nModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        FooterNavigationComponent: {
          component: MakaFooterNavigationComponent,
          disableSSR: false,
          guards: [MakaAccessSiteGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaFooterNavigationComponent],
  entryComponents: [MakaFooterNavigationComponent],
  exports: [MakaFooterNavigationComponent],
})
export class MakaFooterNavigationModule {}
