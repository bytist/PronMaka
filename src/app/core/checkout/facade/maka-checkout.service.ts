import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AuthService,
  ActiveCartService,
  StateWithCheckout,
  CheckoutSelectors,
  CheckoutService, OccEndpointsService, OCC_USER_ID_ANONYMOUS, InterceptorUtil, USE_CLIENT_TOKEN, ORDER_NORMALIZER, ConverterService,
} from '@spartacus/core';

import { MakaOrder } from '../../models';
import { MakaCheckoutActions } from '../store/actions';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const FULL_PARAMS = 'fields=FULL';

@Injectable({
  providedIn: 'root',
})
export class MakaCheckoutService extends CheckoutService {
  constructor(
    protected checkoutStore: Store<StateWithCheckout>,
    protected authService: AuthService,
    protected activeCartService: ActiveCartService,
    private occEndpointsService: OccEndpointsService,
    private http: HttpClient,
    private converter: ConverterService
  ) {
    super(checkoutStore, authService, activeCartService);
  }

  /**
   * Get order details
   */
  getOrderDetails(): Observable<MakaOrder> {
    return this.checkoutStore.pipe(
      select(CheckoutSelectors.getCheckoutOrderDetails)
    );
  }

  placeOrderConditional(userId, cartId): void {
    this.checkoutStore.dispatch(
      new MakaCheckoutActions.PlaceOrderConditional({
        userId,
        cartId,
      })
    );
  }

  placeOrder3ds(userId: string, cartId: string): void {
    this.checkoutStore.dispatch(
      new MakaCheckoutActions.PlaceOrder3ds({
        userId,
        cartId
      })
    );
  }

  /**
   * place 3ds order for current user and cart
   */
  completePlaceOrderWith3DS(userId: string, cartId: string): Observable<MakaOrder> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    const params = new HttpParams({
      fromString: 'cartId=' + cartId + '&' + FULL_PARAMS,
    });
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    if (userId === OCC_USER_ID_ANONYMOUS) {
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }

    return this.http.post<MakaOrder>(`${baseUrl}/users/${userId}/orders/3ds`, {}, {headers, params})
      .pipe(
        this.converter.pipeable(ORDER_NORMALIZER),
        map(order => order as MakaOrder)
      );
  }

  isPaymentWith3dSecure(order: MakaOrder): boolean {
    return !!order.openPay3DSTransactionId;
  }
}
