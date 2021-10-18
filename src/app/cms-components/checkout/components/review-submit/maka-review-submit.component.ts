import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {Card, CheckoutConfigService, PromotionService, ReviewSubmitComponent} from '@spartacus/storefront';
import {
  CheckoutPaymentService,
  TranslationService,
  UserAddressService,
  AuthService,
  PaymentDetails, CheckoutDeliveryService, ActiveCartService
} from '@spartacus/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { cloneDeep, isEmpty } from 'lodash';

import { MakaAddress } from 'src/app/core/models/maka-address.model';
import { MakaPaymentMethodService } from '../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { PaymentModeActive, PaymentProviders } from '../payment-method/maka-payment-method.model';
import { MakaCart } from '../../../../core/models/maka-cart.model';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';

@Component({
  selector: 'app-maka-review-submit',
  templateUrl: './maka-review-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaReviewSubmitComponent extends ReviewSubmitComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  cart$: Observable<MakaCart> = this.activeCartService.getActive();
  paymentMethodCard$ = new BehaviorSubject<Card>({} as Card);
  deliveryAddressCard$ = new BehaviorSubject<Card>({} as Card);
  deliveryAddress$ = this.checkoutDeliveryService.getDeliveryAddress();
  hasPaymentAddress: boolean;
  paymentAddress$ = new BehaviorSubject<MakaAddress>({} as MakaAddress);
  paymentAddressCard$ = new BehaviorSubject<Card>({} as Card);
  taxInfoCard$ = new BehaviorSubject<Card>({} as Card);

  constructor(
    checkoutDeliveryService: CheckoutDeliveryService,
    checkoutPaymentService: CheckoutPaymentService,
    userAddressService: UserAddressService,
    activeCartService: ActiveCartService,
    translation: TranslationService,
    checkoutConfigService: CheckoutConfigService,
    promotionService: PromotionService,
    private paymentMethodService: MakaPaymentMethodService,
    private authService: AuthService,
    private makaActiveCartService: MakaActiveCartService,
    private changeDetector: ChangeDetectorRef,
  ) {
    super(
      checkoutDeliveryService,
      checkoutPaymentService,
      userAddressService,
      activeCartService,
      translation,
      checkoutConfigService,
      promotionService
    );
  }

  ngOnInit(): void {
    this.hasPaymentAddress = false;
    this.makaActiveCartService.getCartParamsRequest(this.unsubscribe$)
      .pipe(
        tap( ([userId, cartId]) => {
          return this.makaActiveCartService.loadCart(userId, cartId); // Force to reload Cart
        }),
        concatMap(() => this.makaActiveCartService.isStable()), // Similar to isLoaded, check if are pending requests
        switchMap( () => this.cart$),
        takeUntil(this.unsubscribe$)
      ).subscribe((cartData) => {
        if (cartData.paymentAddress) {
          this.hasPaymentAddress = true;
          this.paymentAddress$.next(cartData.paymentAddress);
          this.getPaymentAddressCard();
          this.getTaxInfoCard();
        } else {
          this.hasPaymentAddress = false;
        }
        this.changeDetector.detectChanges();
    });

    this.getPaymentModeSelected();
    this.getDeliveryAddressCard();

    super.ngOnInit();
  }

  // ToDo: We need to refactor and get together all addresses functions across checkout,
  //  they were implemented in multiple components as part of MAKA-89 we can make a util
  //  and remove duplicated code
  getTextAddress(AddressObject: MakaAddress): string[] {
    if (!AddressObject) {
      return [];
    }
    const newAddress = cloneDeep(AddressObject);

    //  ToDo: We must ensure that AddressObject.region always contains name
    if (AddressObject.region) {
      if (AddressObject.region.name) {
        newAddress.region = newAddress.region.name;
      } else {
        newAddress.region = newAddress.region.isocode;
      }
    }

    newAddress.townLine = `${newAddress.town}, ${newAddress.region}`;

    newAddress.line1 = `${newAddress.streetName} ${newAddress.streetNumber}`;
    if (newAddress.appartement) {
      newAddress.line1 = `${newAddress.line1} - ${newAddress.appartement}`;
    }

    return Object.values([
      'line1',
      'district',
      'townLine',
      'postalCode',
      'cellphone',
      'petName'
    ]).map((key) => {
      return newAddress[key];
    });
  }

  getDeliveryAddressCard() {
    combineLatest([
      this.translation.translate('checkoutReview.shippingAddress'),
      this.deliveryAddress$
    ]).pipe(
        take(1),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([textTitle, deliveryAddress]) => {
        this.deliveryAddressCard$.next({
          title: textTitle,
          textBold: `${deliveryAddress.firstName} ${deliveryAddress.lastName}`,
          text: this.getTextAddress(deliveryAddress)
        });
      });
  }

  getPaymentMethodCard(paymentDetails: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translation.translate('checkoutReview.paymentMethod'),
      this.translation.translate('checkoutReview.expiration', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
    ]).pipe(
      takeUntil(this.unsubscribe$),
      map(([textTitle, textExpires]) => {
        return {
          title: textTitle,
          textBold: paymentDetails.accountHolderName,
          text: [paymentDetails.cardNumber, textExpires],
        };
      })
    );
  }

  /**
   * Create card depending on active payment selected
   * previously by user
   */
  getPaymentCard(paymentModeActive: PaymentModeActive): Observable<Card> {
    if (paymentModeActive.code === PaymentProviders.CREDIT_CARD) {
      return this.paymentDetails$
        .pipe(
          take(1),
          takeUntil(this.unsubscribe$),
          map((payment) => {
            const paymentCardMasked = cloneDeep(payment);
            paymentCardMasked.cardNumber = paymentCardMasked && paymentCardMasked
              .cardNumber.replace(/X/gi, '*');
            return paymentCardMasked;
          }),
          switchMap((payment) => this.getPaymentMethodCard(payment)),
        );
    }

    return this.translation.translate('checkoutReview.paymentMethod').pipe(
      takeUntil(this.unsubscribe$),
      map((textTitle: string) => {
        return ({
          title: textTitle,
          textBold: paymentModeActive.name,
        });
      })
    );

  }

  getPaymentAddressCard(): void {
    combineLatest([
      this.translation.translate('checkoutReview.paymentAddress'),
      this.paymentAddress$
    ]).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(([textTitle, paymentAddress]) => {
      if (!isEmpty(paymentAddress)) {
        this.paymentAddressCard$.next({
          title: textTitle,
          text: [
            paymentAddress.legalEntityName,
            ...this.getTextAddress(paymentAddress)
          ]
        });
      }
    });
  }

  getTaxInfoCard(): void {
    combineLatest([
      this.translation.translate('checkoutReview.taxInfo'),
      this.paymentAddress$
    ]).pipe(takeUntil(this.unsubscribe$)).subscribe(([textTitle, paymentAddress]) => {
      if (isEmpty(paymentAddress)) {
        return;
      }
      this.taxInfoCard$.next({
        title: textTitle,
        text: [
          paymentAddress.rfc,
          paymentAddress.legalEntityName,
        ]
      });
    });
  }

  /**
   * GET /paymentmode selected by user
   */
  getPaymentModeSelected(): void {
    combineLatest([
      this.authService.getOccUserId(),
      this.activeCartService.getActiveCartId(),
    ]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([userId, cartId]) => Boolean(userId && cartId)),
      switchMap(([userId, cartId]) => this.paymentMethodService.getPaymentMode(userId, cartId).pipe(takeUntil(this.unsubscribe$))),
      switchMap((paymentModeActive: PaymentModeActive) => this.getPaymentCard(paymentModeActive))
    ).subscribe((paymentCard: Card) => {
      this.paymentMethodCard$.next(paymentCard);
    });
  }

  /**
   * Unsubscribe to observables added to this.subscription
   * All subscriptions to observables should be "closed" when component destroys
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
