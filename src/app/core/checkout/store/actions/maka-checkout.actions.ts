import { Action } from '@ngrx/store';
import { StateUtils, Address } from '@spartacus/core';
import { SET_DELIVERY_ADDRESS_PROCESS_ID, PROCESS_FEATURE } from '@spartacus/core';

export const MAKA_SET_DELIVERY_ADDRESS = '[Checkout] Maka Set Delivery Address';
export const MAKA_ADD_DELIVERY_ADDRESS = '[Checkout] Maka Add Delivery Address';
export const MAKA_PLACE_ORDER_CONDITIONAL = '[Checkout] Place Order without Delete Cart';
export const MAKA_PLACE_ORDER_3DS = '[Checkout] Place Order 3ds';

export class SetDeliveryAddress extends StateUtils.EntityLoadAction {
  readonly type = MAKA_SET_DELIVERY_ADDRESS;
  constructor(
    public payload: { userId: string; cartId: string; address: Address }
  ) {
    super(PROCESS_FEATURE, SET_DELIVERY_ADDRESS_PROCESS_ID);
  }
}

export class AddDeliveryAddress implements Action {
  readonly type = MAKA_ADD_DELIVERY_ADDRESS;
  constructor(
    public payload: { userId: string; cartId: string; address: Address }
  ) {}
}

export class PlaceOrderConditional implements Action {
  readonly type = MAKA_PLACE_ORDER_CONDITIONAL;
  constructor(public payload: { userId: string; cartId: string }) {}
}

export class PlaceOrder3ds implements Action {
  readonly type = MAKA_PLACE_ORDER_3DS;
  constructor(public payload: { userId: string; cartId: string }) {}
}
