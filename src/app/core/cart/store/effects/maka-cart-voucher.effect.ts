import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalMessageService, GlobalMessageType, CartActions, ErrorModel } from '@spartacus/core';

@Injectable()
export class MakaCartVoucherEffects {
  constructor(
    private actions$: Actions,
    private globalMessageService: GlobalMessageService
  ) {}

  @Effect({dispatch: false})
  cartAddVoucherFail$: Observable<CartActions.CartAddVoucherFail> = this.actions$.pipe(
    ofType(CartActions.CART_ADD_VOUCHER_FAIL),
    tap((action: any) => {
      const errorResponse = action.payload.error;

      if (errorResponse && errorResponse.error) {
        const errors: ErrorModel[] = JSON.parse(errorResponse.error).errors;
        if (errors.length) {
          this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
          switch (errors[0].message) {
            case 'coupon.already.redeemed':
              this.globalMessageService.add({ key: 'voucher.voucherAlreadyUsed' }, GlobalMessageType.MSG_TYPE_ERROR);
              break;
            default:
              this.globalMessageService.add({ key: 'voucher.voucherInvalid' }, GlobalMessageType.MSG_TYPE_ERROR);
              break;
          }
        }
      }
    })
  );
}
