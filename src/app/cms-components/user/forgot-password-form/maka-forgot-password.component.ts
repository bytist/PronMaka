import { Component } from '@angular/core';
import { ForgotPasswordComponent } from '@spartacus/storefront';
import { FormBuilder } from '@angular/forms';
import {
  RoutingService,
  UserService
} from '@spartacus/core';

@Component({
  selector: 'app-maka-forgot-password-component',
  templateUrl: './maka-forgot-password.component.html'
})
export class MakaForgotPasswordComponent extends ForgotPasswordComponent {}
