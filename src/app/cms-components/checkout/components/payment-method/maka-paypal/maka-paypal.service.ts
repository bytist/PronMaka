import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalMessageService, GlobalMessageType, OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';

import { PaypalAuthorizeResponse, PaypalCreateResponse } from './maka-paypal.model';

/**
 * Further documentation: https://developer.paypal.com/docs/checkout/reference/customize-sdk/#query-parameters
 */
@Injectable({
  providedIn: 'root'
})
export class MakaPaymentPaypalService {
  constructor(
    private http: HttpClient,
    private globalMessageService: GlobalMessageService,
    private occEndpointsService: OccEndpointsService
  ) {
  }

  createOrder(userId: string, cartId: string): Observable<PaypalCreateResponse> {
    const occEndpointPayments = this.occEndpointsService.getUrl('paypalCreate', {userId, cartId});
    return this.http.post<PaypalCreateResponse>(occEndpointPayments, {});
  }

  captureOrder(userId: string, cartId: string): Observable<PaypalAuthorizeResponse> {
    const occEndpointPayments = this.occEndpointsService.getUrl('paypalCapture', {userId, cartId});
    return this.http.post<PaypalAuthorizeResponse>(occEndpointPayments, {});
  }

  handlePaymentError(): void {
    // Removes the automatic error message shown by spartacus
    this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
    this.globalMessageService.add({key: 'checkout.placementError'}, GlobalMessageType.MSG_TYPE_ERROR);
  }
}
