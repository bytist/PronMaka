import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

import { MakaCheckoutLoginComponent } from './maka-checkout-login.component';
import { MakaLoginFormModule } from '../login-form/maka-login-form.module';
import { MakaNotCheckoutAuthGuard } from '../../checkout/guards/maka-not-checkout-auth.guard';


@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    MakaLoginFormModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        GuestCheckoutLoginComponent: {
          component: MakaCheckoutLoginComponent,
          guards: [MakaNotCheckoutAuthGuard],
        },
      },
    } as CmsConfig),
  ],
  declarations: [MakaCheckoutLoginComponent],
  exports: [MakaCheckoutLoginComponent],
  entryComponents: [MakaCheckoutLoginComponent],
})
export class MakaCheckoutLoginModule {}
