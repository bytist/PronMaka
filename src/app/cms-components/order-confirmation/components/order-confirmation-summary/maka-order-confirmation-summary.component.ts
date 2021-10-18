import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { MakaCheckoutService } from '../../../../core/checkout/facade/maka-checkout.service';
import { MakaOrder } from '../../../../core/models';
import { MakaCart } from '../../../../core/models/maka-cart.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-maka-order-confirmation-summary',
  templateUrl: './maka-order-confirmation-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOrderConfirmationSummaryComponent implements OnInit, OnDestroy {
  @Input() order$: Observable<MakaOrder>;

  cart$: BehaviorSubject<MakaCart> = new BehaviorSubject({} as MakaCart);
  private unsubscribe$ = new Subject<void>();

  constructor(protected checkoutService: MakaCheckoutService) {}

  ngOnInit(): void {
    this.order$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((orderData) => {
      this.cart$.next(orderData as MakaCart);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
