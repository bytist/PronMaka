import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActiveCartService, AuthRedirectService } from '@spartacus/core';
import { CheckoutLoginComponent, CustomFormValidators } from '@spartacus/storefront';

@Component({
  selector: 'app-maka-checkout-login',
  templateUrl: './maka-checkout-login.component.html',
})
export class MakaCheckoutLoginComponent extends CheckoutLoginComponent {
  checkoutLoginForm: FormGroup = this.formBuilder.group(
    {
      email: ['', [Validators.required, CustomFormValidators.emailValidator]],
    }
  );

  constructor(
    protected formBuilder: FormBuilder,
    protected authRedirectService: AuthRedirectService,
    protected activeCartService: ActiveCartService
  ) {
    super(formBuilder, authRedirectService, activeCartService);
  }

}
