import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CheckoutConfigService, PaymentMethodComponent } from '@spartacus/storefront';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  ActiveCartService,
  AuthService,
  CheckoutDeliveryService,
  CheckoutPaymentService,
  CheckoutService,
  GlobalMessageService,
  RoutingService,
  TranslationService,
  UserPaymentService
} from '@spartacus/core';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PaymentMode, PaymentProviders } from './maka-payment-method.model';
import { MakaPaymentMethodService } from '../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { environment } from '../../../../../environments/environment';
import { MakaCart } from '../../../../core/models/maka-cart.model';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';

@Component({
  selector: 'app-maka-payment-method',
  templateUrl: './maka-payment-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaPaymentMethodComponent extends PaymentMethodComponent implements OnInit, OnDestroy {

  paymentMethodForm: FormGroup;
  paymentMethods$: Observable<PaymentMode[]> = this.getPaymentMethods();
  isLoading =  false;
  cart: MakaCart;
  paymentProviders = PaymentProviders;
  environmentVars = environment;
  invoiceRequired = null;
  cartId: string;
  userId: string;

  private unsubscribe$ = new Subject<void>();

  constructor(
    userPaymentService: UserPaymentService,
    checkoutService: CheckoutService,
    checkoutDeliveryService: CheckoutDeliveryService,
    checkoutPaymentService: CheckoutPaymentService,
    globalMessageService: GlobalMessageService,
    routingService: RoutingService,
    checkoutConfigService: CheckoutConfigService,
    activatedRoute: ActivatedRoute,
    translation: TranslationService,
    activeCartService: ActiveCartService,
    private paymentMethodService: MakaPaymentMethodService,
    private authService: AuthService,
    private makaActiveCartService: MakaActiveCartService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super(
      userPaymentService,
      checkoutService,
      checkoutDeliveryService,
      checkoutPaymentService,
      globalMessageService,
      routingService,
      checkoutConfigService,
      activatedRoute,
      translation,
      activeCartService
    );
  }

  // Getter for method selected by user
  get paymentMethodRadio(): AbstractControl { // @todo paymentmode ENUM
    return this.paymentMethodForm.get('paymentMethod');
  }

  get isPaymentWithCC(): boolean {
    return this.paymentMethodRadio.value === this.paymentProviders.CREDIT_CARD;
  }

  ngOnInit(): void {
    // Instantiate new Reactive Form
    this.paymentMethodForm = new FormGroup({
      paymentMethod: new FormControl('', Validators.required)
    });

    // Get params to call payment mode saving
    this.getParamsSetPaymentMode();

    // Part of ngOnInit parent, reason we aren't invoking super.onInit
    this.checkoutStepUrlNext = this.checkoutConfigService.getNextCheckoutStepUrl(
      this.activatedRoute
    );

    this.checkoutStepUrlPrevious = this.checkoutConfigService.getPreviousCheckoutStepUrl(
      this.activatedRoute
    );
    // End of ngOnInit parent

    // Set init values & billingFormStatus
    this.getCurrentCart();

    this.paymentMethodService.isGoNextTriggered$
      .pipe(
        filter(isTriggered => isTriggered),
        takeUntil(this.unsubscribe$))
      .subscribe(() => {
        // Set Valid forms if child components are not loaded
        if (!this.invoiceRequired) {
          this.paymentMethodService.setIsBillingFormValid(true);
        }

        if (this.paymentMethodRadio.value === this.paymentProviders.PAYPAL) {
          this.paymentMethodService.setIsCCFormValid(true);
        }
      });
  }

  goNext() {
    this.isLoading = true;
    this.paymentMethodForm.markAllAsTouched();
    this.paymentMethodService.goNextStep(true); // Notify child components
    this.changeDetector.detectChanges();

    if (this.paymentMethodForm.valid) {
      if (!this.isPaymentWithCC && !this.invoiceRequired) {
        super.goNext();
        this.isLoading = false;
      } else {
        this.paymentMethodService.isGoNextAllowed()
          .pipe(
            distinctUntilChanged(),
            takeUntil(this.unsubscribe$))
          .subscribe((isValid) => {
            if (isValid) {
              super.goNext();
            }
            this.isLoading = false;
            this.changeDetector.markForCheck();
          });
      }
      this.deleteBillingFromCart();
    } else {
      this.isLoading = false;
      this.changeDetector.markForCheck();
    }
  }

  toggleBillingForm() {
    this.invoiceRequired = !this.invoiceRequired;
  }

  /**
   * Custom method to retrieve payment types
   */
  getPaymentMethods(): Observable<PaymentMode[]> {
    return combineLatest([
      this.paymentMethodService.getPaymentModes(),
      this.activeCartService.getActive()
    ])
    .pipe(
      filter(([paymentModes, makaCart]) => Boolean(paymentModes.length > 0 && Boolean(makaCart.code))),
      switchMap(([paymentModes, makaCart]) => {
        const hasRecurrenceOrder = Boolean((makaCart as MakaCart).recurrence);
        let filteredPaymentModes = cloneDeep(paymentModes);
        if (hasRecurrenceOrder) {
          filteredPaymentModes = paymentModes.filter((paymentMode) => paymentMode.code !== this.paymentProviders.PAYPAL);
        }
        return of(filteredPaymentModes);
      })
    );
  }

  /**
   * Update the paymentMode for the current cart
   */
  changePaymentMode(paymentMode: string): void {
    this.paymentMethodService
      .setPaymentMode(paymentMode, this.userId, this.cartId)
      .pipe(
        take(1),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        ScrollTrigger.refresh(); // Update scroll size when page is longer (many CC saved)
        this.changeDetector.detectChanges();
      });
  }

  private deleteBillingFromCart() {
    if (!this.invoiceRequired && Object(this.cart).hasOwnProperty('paymentAddress')) {
      this.makaActiveCartService
        .removeCartPaymentAddress(this.cartId, this.userId)
        .subscribe(); // Unsubscription not necessary from HTTP call
    }
  }

  private getCurrentCart(): void {
    this.makaActiveCartService.getActive()
      .pipe(
        map(cart => cart as MakaCart),
        takeUntil(this.unsubscribe$),
      ).subscribe((cart) => {
        this.cart = cart;
        if (cart.paymentMode) {
          this.paymentMethodRadio.setValue(cart.paymentMode.code);
        }
        this.invoiceRequired = Object(this.cart).hasOwnProperty('paymentAddress');

        this.changeDetector.detectChanges();
    });
  }

  /**
   * Params for PUT /paymentmode invoked on submit form
   */
  private getParamsSetPaymentMode(): void {
    combineLatest([this.authService.getOccUserId(), this.activeCartService.getActiveCartId()])
      .pipe(
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([userId, cartId]) => {
        this.userId = userId;
        this.cartId = cartId;
        this.makaActiveCartService.loadCart(this.userId, this.cartId); // Force to load Get cart onInit
      });
  }

  /**
   * Unsubscribe to observables added to this.subscription
   * All subscriptions to observables should be "closed" when component destroys
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    super.ngOnDestroy();
  }
}
