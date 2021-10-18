import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  I18nModule,
  NotAuthGuard,
  provideDefaultConfig,
  UrlModule
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaResetPasswordFormComponent } from './maka-reset-password-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    I18nModule,
    FormErrorsModule,
    UrlModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ResetPasswordComponent: {
          component: MakaResetPasswordFormComponent,
          guards: [NotAuthGuard],
        },
      },
    }),
  ],
  declarations: [MakaResetPasswordFormComponent],
  exports: [MakaResetPasswordFormComponent],
  entryComponents: [MakaResetPasswordFormComponent]
})
export class MakaResetPasswordFormModule { }
