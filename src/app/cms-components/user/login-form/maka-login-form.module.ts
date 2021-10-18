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

import { MakaLoginFormComponent } from './maka-login-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ReturningCustomerLoginComponent: {
          component: MakaLoginFormComponent,
          disableSSR: false,
          guards: [NotAuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaLoginFormComponent],
  exports: [MakaLoginFormComponent],
  entryComponents: [MakaLoginFormComponent]
})
export class MakaLoginFormModule { }
