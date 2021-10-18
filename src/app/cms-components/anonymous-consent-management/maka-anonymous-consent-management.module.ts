import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardFocusModule } from '@spartacus/storefront';
import {
  I18nModule,
  FeaturesConfigModule,
  CmsConfig,
  provideDefaultConfig,
  DeferLoadingStrategy
} from '@spartacus/core';

import { MakaAnonymousConsentManagementBannerComponent } from './anonymous-consent-management-banner/maka-anonymous-consent-management-banner.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FeaturesConfigModule,
    KeyboardFocusModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AnonymousConsentManagementBannerComponent: {
          component: MakaAnonymousConsentManagementBannerComponent,
          deferLoading: DeferLoadingStrategy.INSTANT,
          disableSSR: false
        }
      },
    } as CmsConfig),
  ],
  declarations: [MakaAnonymousConsentManagementBannerComponent],
  exports: [MakaAnonymousConsentManagementBannerComponent],
  entryComponents: [MakaAnonymousConsentManagementBannerComponent]
})
export class MakaAnonymousConsentManagementModule { }
