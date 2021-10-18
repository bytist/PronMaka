import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';

@Component({
  selector: 'app-maka-order-confirmation-totals',
  templateUrl: './maka-order-confirmation-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOrderConfirmationTotalsComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  order$ = this.checkoutService.getOrderDetails().pipe(takeUntil(this.unsubscribe$));

  constructor(protected checkoutService: MakaCheckoutService) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.checkoutService.clearCheckoutData();
  }
}
