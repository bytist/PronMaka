import { NgModule } from '@angular/core';

import { MakaLoginModule } from './login/maka-login.module';
import { MakaHamburgerMenuModule } from '../../layout/header/hamburger-menu/maka-hamburger-menu.module';
import { MakaLoginFormModule } from './login-form/maka-login-form.module';
import { MakaRegisterModule } from './register/maka-register.module';
import { MakaCheckoutLoginModule } from './checkout-login/maka-checkout-login.module';
import { MakaForgotPasswordModule } from './forgot-password-form/maka-forgot-password.module';
import { MakaResetPasswordFormModule } from './reset-password-form/maka-reset-password-form.module';

@NgModule({
  imports: [
    MakaLoginModule,
    MakaHamburgerMenuModule,
    MakaLoginFormModule,
    MakaRegisterModule,
    MakaCheckoutLoginModule,
    MakaForgotPasswordModule,
    MakaResetPasswordFormModule
  ],
  exports: [
    MakaLoginModule,
    MakaLoginFormModule,
    MakaRegisterModule,
    MakaCheckoutLoginModule,
    MakaForgotPasswordModule,
    MakaResetPasswordFormModule
  ],
})
export class MakaUserModule { }
