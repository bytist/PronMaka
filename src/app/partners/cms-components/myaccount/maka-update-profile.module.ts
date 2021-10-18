import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  I18nModule,
  provideDefaultConfig,
  AuthGuard,
  CmsConfig
} from '@spartacus/core';
import { SpinnerModule } from '@spartacus/storefront';

import { MakaPartnerUpdateProfileComponent } from './profile/maka-update-profile.component';
import { MakaPartnerUserFormModule } from '../user/user-form/maka-user-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    I18nModule,
    MakaPartnerUserFormModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        PartnerProfileComponent: {
          component: MakaPartnerUpdateProfileComponent,
          guards: [AuthGuard],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaPartnerUpdateProfileComponent]
})
export class MakaPartnerUpdateProfileModule { }
