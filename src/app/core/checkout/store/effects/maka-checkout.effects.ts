import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, mergeMap, catchError, switchMap, filter } from 'rxjs/operators';
import {
  GlobalMessageService,
  CheckoutActions,
  GlobalMessageType,
  RoutingService,
  CheckoutDeliveryConnector,
  withdrawOn,
  SiteContextActions,
  OCC_USER_ID_ANONYMOUS,
  UserActions,
  CheckoutConnector,
  CartActions, GlobalMessageActions,
  ErrorModel,
  ActiveCartService
} from '@spartacus/core';

import { MakaCheckoutActions } from '../../store/actions/index';
import { MakaPlaceOrderService } from '../../../../cms-components/checkout/components/place-order/maka-place-order.service';
import { MakaPaymentMethodService } from '../../../../shared/services/maka-payment-method/maka-payment-method.service';
import { makeErrorSerializable } from '../../../util/serialization-utils';
import { MakaCheckoutService } from '../../facade/maka-checkout.service';
import { MakaOrder } from '../../../models';

@Injectable()
export class MakaCheckoutEffects {

  private contextChange$ = this.actions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  constructor(
    private globalMessageService: GlobalMessageService,
    private actions$: Actions,
    private routingService: RoutingService,
    private checkoutDeliveryConnector: CheckoutDeliveryConnector,
    private makaPlaceOrderService: MakaPlaceOrderService,
    private paymentMethodService: MakaPaymentMethodService,
    private checkoutConnector: CheckoutConnector,
    private checkoutService: MakaCheckoutService,
    private activeCartService: ActiveCartService
  ) {}

  @Effect({dispatch: false})
  placeOrderFail$: Observable<CheckoutActions.PlaceOrderFail> = this.actions$.pipe(
    ofType(CheckoutActions.PLACE_ORDER_FAIL),
    tap((action: any) => {
      let shouldAttemptPayment = false;
      const errorResponse = action.payload.error;
      if (errorResponse) {
        const errors: ErrorModel[] = JSON.parse(errorResponse).errors;
        // for guest user, check for 3DS tokenization error
        shouldAttemptPayment = (
          this.activeCartService.isGuestCart() &&
          errors.length && (errors[0].type === 'Token3DSOperationError')
        );
      }

      if (shouldAttemptPayment) {
        this.paymentMethodAttempt();
      } else {
        this.goToReviewOrder();
      }
    })
  );

  @Effect({dispatch: false})
  createPaymentDetails$: Observable<CheckoutActions.CreatePaymentDetailsSuccess> = this.actions$.pipe(
    ofType(CheckoutActions.CREATE_PAYMENT_DETAILS_SUCCESS),
    tap(() => {
      this.paymentMethodService.setIsCCFormValid(true);
    }));

  @Effect()
  setDeliveryAddress$: Observable<CheckoutActions.SetDeliveryAddressSuccess
    | CheckoutActions.SetDeliveryAddressFail> = this.actions$.pipe(
    ofType(MakaCheckoutActions.MAKA_SET_DELIVERY_ADDRESS),
    map((action: any) => action.payload),
    filter(payload => payload.address),
    mergeMap((payload) => {
      return this.checkoutDeliveryConnector
        .setAddress(payload.userId, payload.cartId, payload.address.id)
        .pipe(
          mergeMap(() => [
            new CheckoutActions.SetDeliveryAddressSuccess(payload.address),
          ]),
          catchError((error) =>
            of(
              new CheckoutActions.SetDeliveryAddressFail(error)
            )
          )
        );
    }),
    withdrawOn(this.contextChange$)
  );

  @Effect()
  addDeliveryAddress$: Observable<UserActions.LoadUserAddresses
    | MakaCheckoutActions.SetDeliveryAddress
    | CheckoutActions.AddDeliveryAddressFail> = this.actions$.pipe(
    ofType(MakaCheckoutActions.MAKA_ADD_DELIVERY_ADDRESS),
    map((action: MakaCheckoutActions.SetDeliveryAddress) => action.payload),
    mergeMap((payload) =>
      this.checkoutDeliveryConnector
        .createAddress(payload.userId, payload.cartId, payload.address)
        .pipe(
          mergeMap((address) => {
            address['titleCode'] = payload.address.titleCode;
            if (payload.address.region && payload.address.region.isocodeShort) {
              Object.assign(address.region, {
                isocodeShort: payload.address.region.isocodeShort,
              });
            }
            if (payload.userId === OCC_USER_ID_ANONYMOUS) {
              return [
                new MakaCheckoutActions.SetDeliveryAddress({
                  userId: payload.userId,
                  cartId: payload.cartId,
                  address,
                }),
              ];
            } else {
              return [
                new UserActions.LoadUserAddresses(payload.userId),
                new MakaCheckoutActions.SetDeliveryAddress({
                  userId: payload.userId,
                  cartId: payload.cartId,
                  address,
                }),
              ];
            }
          }),
          catchError((error) =>
            of(
              new CheckoutActions.AddDeliveryAddressFail(error)
            )
          )
        )
    ),
    withdrawOn(this.contextChange$)
  );

  /**
   * New effect to replace placeOrder$ effect OOTB
   * The only difference is WHEN the cart is removed, shouldn't be removed if is the 1st placeOrder() with 3d secure
   */
  @Effect()
  placeOrderConditional$: Observable<CheckoutActions.PlaceOrderSuccess
    | CheckoutActions.PlaceOrderFail
    | MakaCheckoutActions.PlaceOrderConditional> = this.actions$.pipe(
    ofType(MakaCheckoutActions.MAKA_PLACE_ORDER_CONDITIONAL),
    map((action: any) => action.payload),
    mergeMap((payload) => {
      return this.checkoutConnector
        .placeOrder(payload.userId, payload.cartId)
        .pipe(
          switchMap((data: MakaOrder) => {
            const deleteAction = [];

            // Remove Cart only when is not payment with 3d secure
            if (!this.checkoutService.isPaymentWith3dSecure(data)) {
              deleteAction.push(new CartActions.RemoveCart({cartId: payload.cartId}));
            }

            return [...deleteAction, new CheckoutActions.PlaceOrderSuccess(data)];
          }),
          catchError((error) =>
            of(new CheckoutActions.PlaceOrderFail(makeErrorSerializable(error)))
          )
        );
    }),
    withdrawOn(this.contextChange$)
  );

  /**
   * Effect to place 3ds order after coming back from 3ds validation
   */
  @Effect()
  placeOrder3ds$: Observable<CheckoutActions.PlaceOrderSuccess
    | GlobalMessageActions.AddMessage
    | CheckoutActions.PlaceOrderFail
    | CartActions.RemoveCart> = this.actions$.pipe(
    ofType(MakaCheckoutActions.MAKA_PLACE_ORDER_3DS),
    map((action: any) => action.payload),
    mergeMap((payload) => {
      return this.checkoutService.completePlaceOrderWith3DS(payload.userId, payload.cartId)
        .pipe(
          switchMap((data) => [
            new CartActions.RemoveCart({cartId: payload.cartId}),
            new CheckoutActions.PlaceOrderSuccess(data),
          ]),
          catchError((error) =>
            of(new CheckoutActions.PlaceOrderFail(makeErrorSerializable(error)))
          ));
    }),
    withdrawOn(this.contextChange$)
  );

  private goToReviewOrder(): void {
    this.routingService.go({cxRoute: 'checkoutReviewOrder'});
    this.makaPlaceOrderService.updatePlaceOrderBtn(false);
    this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
    this.globalMessageService.add({key: 'httpHandlers.paymentCaptureError'}, GlobalMessageType.MSG_TYPE_ERROR);
  }

  private paymentMethodAttempt(): void {
    this.routingService.go({cxRoute: 'checkoutPaymentDetails'});
    this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
    this.globalMessageService.add({key: 'checkout.tokenizationError'}, GlobalMessageType.MSG_TYPE_ERROR);
  }
}
