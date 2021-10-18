import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  PromotionResult,
  PromotionLocation,
} from '@spartacus/core';
import { PromotionService } from '@spartacus/storefront';
import { Observable } from 'rxjs';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

@Component({
  selector: 'app-maka-order-confirmation-items',
  templateUrl: './maka-order-confirmation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOrderConfirmationItemsComponent implements OnInit, OnDestroy {
  promotionLocation: PromotionLocation = PromotionLocation.Checkout;
  order$ = this.checkoutService.getOrderDetails();
  orderPromotions$: Observable<PromotionResult[]>;

  constructor(
    protected checkoutService: MakaCheckoutService,
    protected promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.orderPromotions$ = this.promotionService.getOrderPromotions(
      this.promotionLocation
    );
  }

  ngOnDestroy() {
    this.checkoutService.clearCheckoutData();
  }
}
