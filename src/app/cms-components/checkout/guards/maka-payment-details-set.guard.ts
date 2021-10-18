import { Injectable, isDevMode } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ActiveCartService, AuthService, RoutingConfigService } from '@spartacus/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CheckoutConfigService, CheckoutDetailsService, CheckoutStep, CheckoutStepType } from '@spartacus/storefront';
import { PaymentModeActive, PaymentProviders } from '../components/payment-method/maka-payment-method.model';
import { MakaPaymentMethodService } from '../../../shared/services/maka-payment-method/maka-payment-method.service';

@Injectable({
  providedIn: 'root',
})
export class MakaPaymentDetailsSetGuard implements CanActivate {
  constructor(
    private checkoutDetailsService: CheckoutDetailsService,
    private checkoutConfigService: CheckoutConfigService,
    private routingConfigService: RoutingConfigService,
    private router: Router,
    private activeCartService: ActiveCartService,
    private authService: AuthService,
    private paymentMethodService: MakaPaymentMethodService
  ) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    const checkoutStep: CheckoutStep = this.checkoutConfigService.getCheckoutStep(
      CheckoutStepType.PAYMENT_DETAILS
    );

    if (!checkoutStep && isDevMode()) {
      console.warn(
        `Missing step with type ${CheckoutStepType.PAYMENT_DETAILS} in checkout configuration.`
      );
    }

    return combineLatest([
      this.getPaymentModeSelected(),
      this.canActivateByPaymentDetails(checkoutStep),
    ]).pipe(
      take(1),
      switchMap(([paymentMode, canActivateByPayment]) =>
        paymentMode && paymentMode.code === PaymentProviders.PAYPAL ? of(true) : of(canActivateByPayment)
      )
    );
  }

  getPaymentModeSelected(): Observable<PaymentModeActive> {
    return combineLatest([
      this.authService.getOccUserId(),
      this.activeCartService.getActiveCartId(),
    ]).pipe(
      take(1),
      switchMap(([userId, cartId]) => this.paymentMethodService.getPaymentMode(userId, cartId),
      ));
  }

  canActivateByPaymentDetails(checkoutStep: CheckoutStep): Observable<boolean | UrlTree> {
    return this.checkoutDetailsService
      .getPaymentDetails()
      .pipe(
        map((paymentDetails) => {
            return paymentDetails && Object.keys(paymentDetails).length !== 0
              ? true
              : this.router.parseUrl(checkoutStep &&
                this.routingConfigService.getRouteConfig(checkoutStep.routeName).paths[0]);
          }
        )
      );
  }
}
