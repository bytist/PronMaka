import {
  ActiveCartService,
  AuthService,
  MultiCartService,
  OccEndpointsService,
  StateWithMultiCart,
  InterceptorUtil,
  USE_CLIENT_TOKEN,
  OCC_USER_ID_ANONYMOUS,
  OCC_USER_ID_GUEST,
  EMAIL_PATTERN,
  OrderEntry,
  User,
  Cart
} from '@spartacus/core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MakaAddress } from '../../../core/models';
import { MakaCart } from 'src/app/core/models/maka-cart.model';
import { MakaPartner } from '../../../core/models/maka-user.model';
import { share, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MakaActiveCartService {
  constructor(
    protected store: Store<StateWithMultiCart>,
    protected authService: AuthService,
    protected multiCartService: MultiCartService,
    private occEndpointsService: OccEndpointsService,
    private activeCartService: ActiveCartService,
    private http: HttpClient
  ) {
  }

  static isCartRecurrenceConfigurationValid(cart, openPay3DSMin): boolean {
    if (!cart || !openPay3DSMin) {
      return false;
    }
    return !(this.isAnonymousUserCart(cart) || this.isGuestUserCart(cart) || openPay3DSMin <= cart?.totalPriceWithTax?.value);
  }

  static isUserAnonymousOrGuest(cart): boolean {
    if (!cart) {
      return false;
    }
    return this.isAnonymousUserCart(cart) || this.isGuestUserCart(cart);
  }

  static isAnonymousUserCart(cart: MakaCart) {
    return cart?.user?.uid === OCC_USER_ID_ANONYMOUS;
  }

  // cloned from Active Cart Service
  static isGuestUserCart(cart: MakaCart): boolean {
    return ((cart?.user?.name === OCC_USER_ID_GUEST || this.isEmailAddress(cart?.user?.uid?.split('|').slice(1).join('|')))
    );
  }

  static isEmailAddress(str: string): boolean {
    if (!str) {
      return false;
    }
    return !!str.match(EMAIL_PATTERN);
  }

  protected getEndpoint(userId: string, subEndpoint: string): string {
    const orderEndpoint = 'users/' + userId + subEndpoint;
    return this.occEndpointsService.getEndpoint(orderEndpoint);
  }

  createCartPaymentAddress(cartId: string, userId: string, paymentAddress: MakaAddress): Observable<MakaAddress> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.http.post<MakaAddress>(`${baseUrl}/users/${userId}/carts/${cartId}/addresses/payment`, paymentAddress, {}).pipe(share());
  }

  removeCartPaymentAddress(cartId: string, userId: string): Observable<any> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    return this.http.delete<any>(`${baseUrl}/users/${userId}/carts/${cartId}/addresses/payment`, {});
  }

  addRecurrenceConfiguration(cartId: string, userId: string, configId: string): Observable<MakaCart> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    let headers = new HttpHeaders();
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http.put<MakaCart>(`${baseUrl}/users/${userId}/carts/${cartId}/recurrent/${configId}`, { headers });
  }

  removeRecurrenceConfiguration(cartId: string, userId: string): Observable<any> {
    const url = `${this.getEndpoint(
      userId,
      '/carts/'
    )}${cartId}/recurrent`;
    return this.http.delete<any>(url);
  }

  removeAssociateId(cartId: string, userId: string, associateId: string): Observable<any> {
    const url = `${this.getEndpoint(
      userId,
      '/carts/'
    )}${cartId}/associates/${associateId}`;
    return this.http.delete<any>(url);
  }

  addAssociateId(cartId: string, userId: string, associateId: string): Observable<MakaPartner> {
    const baseUrl = this.occEndpointsService.getBaseEndpoint();
    let headers = new HttpHeaders();
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    return this.http.post<MakaPartner>(`${baseUrl}/users/${userId}/carts/${cartId}/associates/${associateId}`, { headers });
  }

  loadCart(userId: string, cartId: string): void {
    this.multiCartService.loadCart({
      cartId,
      userId
    });
  }

  // @TODO replace across checkout with this Observable
  getCartParamsRequest(unsubscribe): Observable<[string, string]> {
    return combineLatest([
      this.authService.getOccUserId(),
      this.getActiveCartId(),
    ]).pipe(
      take(1),
      takeUntil(unsubscribe)
    );
  }

  /**
   * TODO - all the upcoming methods are OOTB ActiveCartService ones,
   * check for makaActiveCartService and replace by activeCartService in the cases it applies
   * and remove these methods afterwards.
   */

  getActive(): Observable<Cart> {
    return this.activeCartService.getActive();
  }

  getActiveCartId(): Observable<string> {
    return this.activeCartService.getActiveCartId();
  }

  getEntries(): Observable<OrderEntry[]> {
    return this.activeCartService.getEntries();
  }

  getLoading(): Observable<boolean> {
    return this.activeCartService.getLoading();
  }

  isStable(): Observable<boolean> {
    return this.activeCartService.isStable();
  }

  addEntry(productCode: string, quantity: number): void {
    this.activeCartService.addEntry(productCode, quantity);
  }

  removeEntry(entry: OrderEntry): void {
    this.activeCartService.removeEntry(entry);
  }

  updateEntry(entryNumber: number, quantity: number): void {
    this.activeCartService.updateEntry(entryNumber, quantity);
  }

  getEntry(productCode: string): Observable<OrderEntry> {
    return this.activeCartService.getEntry(productCode);
  }

  addEmail(email: string): void {
    this.activeCartService.addEmail(email);
  }

  getAssignedUser(): Observable<User> {
    return this.activeCartService.getAssignedUser();
  }

  isGuestCart(): boolean {
    return this.activeCartService.isGuestCart();
  }

  addEntries(cartEntries: OrderEntry[]): void {
    return this.activeCartService.addEntries(cartEntries);
  }
}
