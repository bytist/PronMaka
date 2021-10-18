import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  I18nModule,
  NotAuthGuard,
  provideDefaultConfig,
  UrlModule
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaForgotPasswordComponent } from './maka-forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ForgotPasswordComponent: {
          component: MakaForgotPasswordComponent,
          guards: [NotAuthGuard],
        },
      },
    }),
  ],
  declarations: [MakaForgotPasswordComponent],
  exports: [MakaForgotPasswordComponent],
  entryComponents: [MakaForgotPasswordComponent]
})
export class MakaForgotPasswordModule { }
