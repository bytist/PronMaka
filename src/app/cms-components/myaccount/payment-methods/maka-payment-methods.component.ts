import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentMethodsComponent } from '@spartacus/storefront';
import {
  ActiveCartService,
  GlobalMessageService,
  GlobalMessageType,
  TranslationService,
  UserPaymentService
} from '@spartacus/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MakaPaymentMethodService } from '../../../shared/services/maka-payment-method/maka-payment-method.service';
import { MakaCart, MakaPaymentDetails } from '../../../core/models/maka-cart.model';
import { MakaActiveCartService } from '../../../shared/services/maka-cart/maka-active-cart.service';


@Component({
  selector: 'app-maka-payment-methods',
  templateUrl: './maka-payment-methods.component.html',
})

export class MakaPaymentMethodsComponent extends PaymentMethodsComponent implements OnInit, OnDestroy {
  cart: MakaCart;
  unsubscribe$ = new Subject<void>();

  constructor(
    userPaymentService: UserPaymentService,
    translation: TranslationService,
    private paymentMethodService: MakaPaymentMethodService,
    private makaActiveCartService: ActiveCartService,
    private globalMessageService: GlobalMessageService,
  ) {
    super(userPaymentService, translation);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.makaActiveCartService.getActive()
      .pipe(
        map(cart => cart as MakaCart),
        takeUntil(this.unsubscribe$),
      ).subscribe((cartData) => {
      this.cart = cartData;
    });
  }

  getCardIcon(code: string): string {
    return this.paymentMethodService.getCardIconForCode(code);
  }

  deletePaymentMethod(paymentMethod: MakaPaymentDetails): void {

    // Prevent delete card selected in checkout
    if (this.cart && this.cart.paymentInfo && this.cart.paymentInfo.id === paymentMethod.id) {
      this.globalMessageService.add({key: 'paymentMethods.errorCreditCardInUser'}, GlobalMessageType.MSG_TYPE_ERROR);
    } else {
      super.deletePaymentMethod(paymentMethod);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
