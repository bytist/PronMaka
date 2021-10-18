import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaActiveCartService } from '../../../../shared/services/maka-cart/maka-active-cart.service';

/**
 * Component rendered after 3d secure check
 */
@Component({
  selector: 'app-maka-placing-order',
  templateUrl: './maka-placing-order.component.html'
})
export class MakaPlacingOrderComponent implements OnInit, OnDestroy {

  placingOrderSubscription: Subscription;

  private unsubscribe$ = new Subject<void>();
  constructor(
    protected makaCheckoutService: MakaCheckoutService,
    protected routingService: RoutingService,
    protected makaActiveCartService: MakaActiveCartService,
  ) { }

  ngOnInit(): void {
    this.makaActiveCartService.getCartParamsRequest(this.unsubscribe$)
      .subscribe(( [userId, cartId]) => {
        this.makaCheckoutService.placeOrder3ds(userId, cartId); // "2nd" placeOrder() in this one should be removed cart
      });

    this.placingOrderSubscription = this.makaCheckoutService
      .getOrderDetails()
      .pipe(filter((order) => Object.keys(order).length !== 0))
      .subscribe(() => {
        this.routingService.go({ cxRoute: 'orderConfirmation' });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    if (this.placingOrderSubscription) {
      this.placingOrderSubscription.unsubscribe();
    }
  }
}
