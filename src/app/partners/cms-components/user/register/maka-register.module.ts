import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  UrlModule,
  I18nModule,
  provideDefaultConfig,
  NotAuthGuard,
  CmsConfig
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaPartnerRegisterComponent } from './maka-register.component';
import { MakaTextBannerModule } from '../../../../cms-components/misc/maka-text-banner/maka-text-banner.module';
import { MakaPartnerUserFormModule } from '../user-form/maka-user-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
    MakaPartnerUserFormModule,
    MakaTextBannerModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        RegisterAssociateComponent: {
          component: MakaPartnerRegisterComponent,
          disableSSR: false,
          guards: [NotAuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaPartnerRegisterComponent],
  exports: [MakaPartnerRegisterComponent],
  entryComponents: [MakaPartnerRegisterComponent]
})
export class MakaPartnerRegisterModule { }
