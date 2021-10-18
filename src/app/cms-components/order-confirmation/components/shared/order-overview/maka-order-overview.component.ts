import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Card } from '@spartacus/storefront';
import { TranslationService } from '@spartacus/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { MakaAddress, MakaOrder, PaymentMode } from 'src/app/core/models';
import { MakaCheckoutService } from '../../../../../core/checkout/facade/maka-checkout.service';

@Component({
  selector: 'app-maka-order-overview',
  templateUrl: './maka-order-overview.component.html',
})
export class MakaOrderOverviewComponent implements OnInit, OnDestroy {
  @Input() order$: Observable<MakaOrder>;
  @Input() displayTitle: boolean;

  private unsubscribe$ = new Subject<void>();
  deliveryAddressCardContent$: BehaviorSubject<Card> = new BehaviorSubject<Card>({} as Card);
  deliveryModeCardContent$: BehaviorSubject<Card> = new BehaviorSubject<Card>({} as Card);
  paymentMethodCardContent$: BehaviorSubject<Card> = new BehaviorSubject<Card>({} as Card);
  billingAddressCardContent$: BehaviorSubject<Card> = new BehaviorSubject<Card>({} as Card);
  taxInfoCardContent$: BehaviorSubject<Card> = new BehaviorSubject<Card>({} as Card);

  constructor(protected checkoutService: MakaCheckoutService, protected translationService: TranslationService) {}

  ngOnInit(): void {
    this.getDeliveryAddressCard();
    this.getDeliveryModeCard();
    this.getPaymentMethodCard();
    this.getBillingAddressCard();
    this.getTaxInfoCard();
  }

  // ToDo: We need to refactor and get together all addresses functions across checkout,
  //  they were implemented in multiple components as part of MAKA-89 we can make a util
  //  and remove duplicated code
  getTextAddress(AddressObject: MakaAddress): string[] {
    if (!AddressObject) {
      return [];
    }
    const newAddress = cloneDeep(AddressObject);

    newAddress.fullName = '';
    if (Boolean(newAddress.firstName)) {
      newAddress.fullName = `${newAddress.firstName} ${newAddress.lastName}`;
    }

    newAddress.region = newAddress.region.name;
    newAddress.townLine = `${newAddress.town}, ${newAddress.region}`;
    newAddress.line1 = `${newAddress.streetName} ${newAddress.streetNumber}`;
    if (newAddress.appartement) {
      newAddress.line1 = `${newAddress.line1} - ${newAddress.appartement}`;
    }

    return Object.values([
      'fullName',
      'legalEntityName',
      'line1',
      'reference',
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
        this.translationService.translate('checkoutReview.shippingAddress'),
        this.order$
    ]).pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$),
      filter(([, orderData]) => Boolean(orderData.deliveryAddress)),
      switchMap(([textTitle, orderData]) => combineLatest([of(textTitle), of(orderData.deliveryAddress)])),
    )
    .subscribe(([textTitle, deliveryAddress]) => {
      this.deliveryAddressCardContent$.next({
        title: textTitle,
        text: this.getTextAddress(deliveryAddress),
      });
    });
  }

  getDeliveryModeCard() {
    this.getOrderInfoCard('checkoutShipping.shippingMethod', 'deliveryMode')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([textTitle, deliveryMode]) => {
        this.deliveryModeCardContent$.next({
          title: textTitle,
          textBold: deliveryMode.name,
          text: [deliveryMode.description],
        });
      });
  }

  getCardPaymentInfo() {
    return this.getOrderInfoCard('checkoutReview.paymentMethod', 'paymentInfo')
      .pipe(
        switchMap(([textTitle, paymentInfo]) =>
          combineLatest([
            of(textTitle),
            of(paymentInfo),
            this.translationService.translate('checkoutReview.expiration', {
              month: paymentInfo.expiryMonth || '',
              year: paymentInfo.expiryYear || '',
            })
          ])
        ),
        map(([textTitle, paymentInfo, textExpires]) => {
          const  newPayment = cloneDeep(paymentInfo);
          newPayment.cardNumber = paymentInfo.cardNumber.replace(/X/gi, '*');
          return [textTitle, newPayment, textExpires];
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe(([textTitle, paymentInfo, textExpires]) => {
        this.paymentMethodCardContent$.next({
          title: textTitle,
          text: [paymentInfo.accountHolderName, paymentInfo.cardNumber, textExpires],
        });
      });
  }

  getPaypalPaymentInfo(paymentMode: PaymentMode) {
    this.translationService.translate('checkoutReview.paymentMethod')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((textTitle) => {
        this.paymentMethodCardContent$.next({
          title: textTitle,
          text: [paymentMode.name],
        });
      });
  }

  // ToDo: Refactor this we need to get reusable functions to display this cards across checkout components
  //  we can also reuse translations for all the cards
  getPaymentMethodCard() {
    this.order$.pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$),
      filter((orderData) => !!orderData),
    ).subscribe((orderDetails) => {
      if (orderDetails?.paymentMode?.code === 'paypal') {
        this.getPaypalPaymentInfo(orderDetails.paymentMode);
      }
      this.getCardPaymentInfo();
    });
  }

  getBillingAddressCard() {
    this.getOrderInfoCard('checkoutReview.paymentAddress', 'paymentAddress')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([textTitle, paymentAddress]) => {
        this.billingAddressCardContent$.next({
          title: textTitle,
          text: this.getTextAddress(paymentAddress),
        });
      });
  }

  getTaxInfoCard() {
    this.getOrderInfoCard('checkoutReview.taxInfo', 'paymentAddress')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([textTitle, paymentAddress]) => {
        this.taxInfoCardContent$.next({
          title: textTitle,
          text: [
            paymentAddress.rfc,
            paymentAddress.legalEntityName,
          ]
        });
      });
  }

  getOrderInfoCard(translationKey: string, orderAttribute: string): Observable<[string, any]> {
    return combineLatest([
      this.translationService.translate(translationKey),
      this.order$
    ]).pipe(
      distinctUntilChanged(),
      takeUntil(this.unsubscribe$),
      filter(([, orderData]) => !!orderData[orderAttribute]),
      switchMap(([textTitle, orderData]) => combineLatest([of(textTitle), of(orderData[orderAttribute])])),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
