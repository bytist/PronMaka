import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AuthGuard,
  CmsConfig,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { SpinnerModule, FormErrorsModule } from '@spartacus/storefront';

import { MakaUpdatePasswordFormComponent } from './update-password-form/maka-update-password-form.component';
import { MakaUpdatePasswordComponent } from './maka-update-password.component';
import { MakaAccessSiteGuard } from '../../../core/guards/access-site/maka-access-site.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    I18nModule,
    FormErrorsModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        UpdatePasswordComponent: {
          component: MakaUpdatePasswordComponent,
          guards: [AuthGuard ],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaUpdatePasswordComponent, MakaUpdatePasswordFormComponent],
  exports: [MakaUpdatePasswordComponent, MakaUpdatePasswordFormComponent],
  entryComponents: [MakaUpdatePasswordComponent],
})
export class MakaUpdatePasswordModule {}
