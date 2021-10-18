import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalMessageService, OccEndpointsService, } from '@spartacus/core';
import {
  catchError,
  distinctUntilChanged,
  filter, finalize, first,
  map,
  share,
  shareReplay,
  tap
} from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { ICON_TYPE } from '@spartacus/storefront';
import { isBoolean } from 'lodash';

import { PaymentMode, PaymentModeActive, PaymentModes } from '../../../cms-components/checkout/components/payment-method/maka-payment-method.model';


@Injectable({
  providedIn: 'root'
})
export class MakaPaymentMethodService {
  isValidBillingForm$ = new BehaviorSubject<boolean>(null);
  isValidCCForm$ = new BehaviorSubject<boolean>(null);
  isGoNextTriggered$ = new BehaviorSubject<boolean>(false);

  private readonly paymentProviders$ = new BehaviorSubject<string[]>([]);
  private iconTypes = ICON_TYPE;

  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private occEndpointsService: OccEndpointsService,
  ) {}

  get paymentProviders(): string[] {
    return this.paymentProviders$.getValue();
  }

  set paymentProviders(val) {
    this.paymentProviders$.next(val);
  }

  /**
   * @action PUT, Send request to backend to save payment selected by user
   * @param paymentModeId, Id from this.getPaymentModes
   */
  // eslint-disable-line
  setPaymentMode(paymentModeId: string, userId: string, cartId: string): Observable<any> {
    const occEndpointPayment = this.occEndpointsService.getUrl('paymentMode', {userId, cartId});

    return this.http.put(
      occEndpointPayment,
      {},
      {params: {paymentModeId}})
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }

  /**
   * @action GET, Get Payment selected by user
   */
  getPaymentMode(userId: string, cartId: string): Observable<PaymentModeActive> {
    const occEndpointPayment = this.occEndpointsService.getUrl('paymentMode', {userId, cartId});
    return this.http
      .get<PaymentModeActive>(occEndpointPayment)
      .pipe(
        shareReplay(1), // @TODO avoid multiplecalls this prevents only 1 call of 4
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  /**
   * @action GET, Retrieve all payment modes available for the user, no auth required
   */
  getPaymentModes(): Observable<PaymentMode[]> {
    const occEndpointPayments = this.occEndpointsService.getUrl('paymentModes');

    return this.http
      .get<PaymentModes>(occEndpointPayments)
      .pipe(
        map(paymentsObj => paymentsObj.paymentModes),
        tap(payments => this.getPaymentMethodCodes(payments)),
        share(),
        catchError((error: HttpErrorResponse) =>  throwError(error)));
  }

  setIsBillingFormValid(isValid: boolean) {
    this.isValidBillingForm$.next(isValid);
  }

  setIsCCFormValid(isValid: boolean) {
    this.isValidCCForm$.next(isValid);
  }

  resetAreValidForms() {
    this.isValidBillingForm$.next(null);
    this.isValidCCForm$.next(null);
    this.isGoNextTriggered$.next(false);
  }

  goNextStep(canGo: boolean) {
    if (canGo) {
      // Reset values before goNext()
      this.isValidBillingForm$.next(null);
      this.isValidCCForm$.next(null);
      if (this.isValidBillingForm$.value === null && this.isValidCCForm$.value === null) {
        this.isGoNextTriggered$.next(true);
      }
    } else {
      this.isGoNextTriggered$.next(false);
    }
  }

  /**
   * isValidCCForm$ & isValidBillingForm$ are set until user clicks on Next Btn
   * Both components should retrieve the value at that moment
   * Both values are reset after each emit from this observable
   */
  isGoNextAllowed(): Observable<boolean> {
    return combineLatest([
      this.isValidCCForm$.pipe(filter(isBoolean)),
      this.isValidBillingForm$.pipe(filter(isBoolean)),
    ]).pipe(
      distinctUntilChanged(),
      map(([ccForm, billForm]) => {
        if (ccForm && billForm) {
          return true;
        }
        return false;
      }),
      first(), // Force to complete combineLatest
      finalize(() => {
          this.resetAreValidForms();
      }) // When emit is completed, reset
    );
  }

  /**
   * Return card icon for given code
   * @param code payment card code
   */
  getCardIconForCode(code: string): string {
    let ccIcon: string;
    switch (code) {
      case 'visa':
        ccIcon = this.iconTypes.VISA;
        break;
      case 'mastercard':
      case 'mastercard_eurocard':
        ccIcon = this.iconTypes.MASTER_CARD;
        break;
      case 'diners':
        ccIcon = this.iconTypes.DINERS_CLUB;
        break;
      case 'amex':
      case 'american_express':
        ccIcon = this.iconTypes.AMEX;
        break;
      default:
        ccIcon = this.iconTypes.CREDIT_CARD;
    }

    return ccIcon;
  }

  // Map and return payment provider codes
  private getPaymentMethodCodes(payments: PaymentMode[]): void {
    this.paymentProviders = payments.map(paymentMethod => paymentMethod.code);
  }
}
