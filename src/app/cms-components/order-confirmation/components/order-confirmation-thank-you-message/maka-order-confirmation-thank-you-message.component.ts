import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CheckoutService, Order } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-maka-order-confirmation-thank-you-message',
  templateUrl: './maka-order-confirmation-thank-you-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOrderConfirmationThankYouMessageComponent
  implements OnInit, OnDestroy {
  order$: Observable<Order>;
  isGuestCustomer = false;
  orderGuid: string;

  constructor(protected checkoutService: CheckoutService) {}

  ngOnInit() {
    this.order$ = this.checkoutService.getOrderDetails();
  }

  ngOnDestroy() {
    this.checkoutService.clearCheckoutData();
  }
}
