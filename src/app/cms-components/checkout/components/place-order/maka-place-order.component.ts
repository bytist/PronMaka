import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, RoutingService } from '@spartacus/core';
import { PlaceOrderComponent } from '@spartacus/storefront';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PaymentMode, PaymentModeActive, PaymentProviders } from '../payment-method/maka-payment-method.model';
import { MakaPaymentMethodService } from '../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { MakaOrder } from 'src/app/core/models';
import { MakaPlaceOrderService } from './maka-place-order.service';
import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';


@Component({
  selector: 'app-maka-place-order',
  templateUrl: './maka-place-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaPlaceOrderComponent extends PlaceOrderComponent implements OnInit, OnDestroy {
  paymentProviders = PaymentProviders;
  paymentMode: PaymentModeActive;
  paypalPayment: PaymentMode;
  isLoading$ = new BehaviorSubject(true);
  tAndCToggler = false;
  disableBtn = false;
  endpointParams: {userId: string, cartId: string};

  checkoutSubmitForm: FormGroup = this.fb.group({
    termsAndConditions: [false, Validators.requiredTrue],
  });

  private unsubscribe$ = new Subject<void>();

  constructor(
    protected checkoutService: MakaCheckoutService,
    protected routingService: RoutingService,
    protected fb: FormBuilder,
    private paymentMethodService: MakaPaymentMethodService,
    private activeCartService: MakaActiveCartService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private makaPlaceOrderService: MakaPlaceOrderService
  ) {
    super(checkoutService, routingService, fb);
  }

  get isPaymentWithPaypal(): boolean {
    return this.paymentMode && this.paymentMode.code === this.paymentProviders.PAYPAL;
  }

  ngOnInit(): void {
    this.makaPlaceOrderService.disablePlaceOrderBtn$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(disableBtn => {
        this.disableBtn = disableBtn;
        this.changeDetector.detectChanges();
      });

    this.getPaymentSelectedByUser();
    this.goToOrderConfirmation();

    this.activeCartService.getCartParamsRequest(this.unsubscribe$)
      .subscribe(( [userId, cartId]) => {
        this.endpointParams = { userId, cartId };
      });
  }

  submitForm(): void {
    if (this.checkoutSubmitForm.valid) {
      this.disableBtn = true;
      this.checkoutService.placeOrderConditional(this.endpointParams.userId, this.endpointParams.cartId);
    } else {
      this.checkoutSubmitForm.markAllAsTouched();
    }
  }

  toggleTAndC(): void {
    this.tAndCToggler = !this.tAndCToggler;
  }

  /**
   * Get payment selected by user in Step 3
   */
  private getPaymentSelectedByUser(): void {
    this.getPaymentModeSelected()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(active => {
        this.paymentMode = active;

        if (this.isPaymentWithPaypal) {
          this.getPaypalPaymentData();
        } else {
          this.isLoading$.next(false);
        }

        this.changeDetector.detectChanges();
      });
  }

  private getPaypalPaymentData(): void {
    this.paymentMethodService.getPaymentModes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(payments => {
        this.paypalPayment = payments.find(payment => payment.code === this.paymentProviders.PAYPAL);
        this.isLoading$.next(false);
        this.changeDetector.detectChanges();
      });
  }

  /**
   * Redirect to order confirmation in success
   */
  private goToOrderConfirmation(): void {
    this.checkoutService
      .getOrderDetails()
      .pipe(
        filter(order => Object.keys(order).length !== 0),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((order) => {
        const makaOrder = order as MakaOrder;
        if (this.checkoutService.isPaymentWith3dSecure(makaOrder))
        {
          window.location.href = makaOrder.openPay3DSTransactionUrl;
        } else {
          this.routingService.go({ cxRoute: 'orderConfirmation' });
        }
        this.changeDetector.detectChanges();
      });
  }

  /**
   * GET /paymentmode selected by user
   */
  private getPaymentModeSelected(): Observable<PaymentModeActive> {
    return combineLatest([
      this.authService.getOccUserId(),
      this.activeCartService.getActiveCartId(),
    ]).pipe(
      take(1),
      switchMap(([userId, cartId]) => {
        return this.paymentMethodService.getPaymentMode(userId, cartId);
      }));
  }

  /**
   * Unsubscribe to observables added to this.subscription
   * All subscriptions to observables should be "closed" when component destroys
   */
  ngOnDestroy(): void {
    this.disableBtn = false;
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    super.ngOnDestroy();
  }
}
