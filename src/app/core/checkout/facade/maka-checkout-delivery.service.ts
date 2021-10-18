import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import {
  AuthService,
  ActiveCartService,
  Address,
  StateWithProcess,
  StateWithCheckout,
  CheckoutDeliveryService,
  OCC_USER_ID_ANONYMOUS,
  DeliveryMode,
  CheckoutSelectors,
  ProcessSelectors,
  CheckoutActions,
  SET_SUPPORTED_DELIVERY_MODE_PROCESS_ID
} from '@spartacus/core';

import { MakaCheckoutActions } from '../store/actions/index';
import { pluck, shareReplay, tap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MakaCheckoutDeliveryService extends CheckoutDeliveryService {
  userId: string;
  cartId: string;

  constructor(
    protected checkoutStore: Store<StateWithCheckout | StateWithProcess<void>>,
    protected authService: AuthService,
    protected activeCartService: ActiveCartService
  ) {
    super(checkoutStore, authService, activeCartService);
  }

  // ToDo: this is called multiple times across this service, we discussed that we need a refactoring to
  //  get and update the user and cart ids at a higher level in the checkout so it can be done one time
  //  for all the screens in the process
  getUserAndCartID() {
    combineLatest([
      this.authService.getOccUserId(),
      this.activeCartService.getActiveCartId()
    ]).subscribe(([occUserId, activeCartId]) => {
        this.userId = occUserId;
        this.cartId = activeCartId;
      }).unsubscribe();
  }

  protected actionAllowed(): boolean {
    this.getUserAndCartID();
    return ((this.userId && this.userId !== OCC_USER_ID_ANONYMOUS) || this.activeCartService.isGuestCart());
  }

  setDeliveryAddress(address: Address): void {
    this.getUserAndCartID();
    this.dispatchAddressAction(
      new MakaCheckoutActions.SetDeliveryAddress({
        userId: this.userId,
        cartId: this.cartId,
        address
      })
    );
  }

  dispatchAddressAction(addressAction): void {
    this.getUserAndCartID();
    if (this.actionAllowed()) {
      if (this.userId && this.cartId) {
        return this.checkoutStore.dispatch(addressAction);
      }
    }
  }

  createAndSetAddress(address: Address): void {
    this.getUserAndCartID();
    this.dispatchAddressAction(
      new MakaCheckoutActions.AddDeliveryAddress({
        userId: this.userId,
        cartId: this.cartId,
        address
      })
    );
  }

  /**
   * Get supported delivery modes
   */
  getSupportedDeliveryModes(): Observable<DeliveryMode[]> {
    return this.checkoutStore.pipe(
      select(CheckoutSelectors.getSupportedDeliveryModes),
      withLatestFrom(
        this.checkoutStore.pipe(
          select(ProcessSelectors.getProcessStateFactory(SET_SUPPORTED_DELIVERY_MODE_PROCESS_ID))
        )
      ),
      tap(([, loadingState]) => {
        if (
          !(loadingState.loading || loadingState.success || loadingState.error)
        ) {
          this.loadSupportedDeliveryModes();
        }
      }),
      pluck(0),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  /**
   * Load supported delivery modes
   */
  loadSupportedDeliveryModes(): void {
    if (this.actionAllowed()) {
      if (this.userId && this.cartId) {
        this.checkoutStore.dispatch(
          new CheckoutActions.LoadSupportedDeliveryModes({
            userId: this.userId,
            cartId: this.cartId,
          })
        );
      }
    }
  }
}
