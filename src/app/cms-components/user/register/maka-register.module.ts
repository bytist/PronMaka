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
import { FormErrorsModule, SpinnerModule } from '@spartacus/storefront';

import { MakaRegisterComponent } from './maka-register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UrlModule,
    I18nModule,
    FormErrorsModule,
    SpinnerModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        RegisterCustomerComponent: {
          component: MakaRegisterComponent,
          disableSSR: false,
          guards: [NotAuthGuard]
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaRegisterComponent],
  exports: [MakaRegisterComponent],
  entryComponents: [MakaRegisterComponent]
})
export class MakaRegisterModule { }
