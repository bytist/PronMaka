import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderDetailsService } from '@spartacus/storefront';

import { MakaCart } from '../../../../../core/models/maka-cart.model';

@Component({
  selector: 'app-maka-order-details-totals',
  templateUrl: './maka-order-details-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakaOrderDetailsTotalsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  order$ = this.orderDetailsService.getOrderDetails().pipe(takeUntil(this.unsubscribe$));
  cart$: BehaviorSubject<MakaCart> = new BehaviorSubject({} as MakaCart);

  constructor(protected orderDetailsService: OrderDetailsService) {}

  ngOnInit(): void {
    this.order$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((orderData) => {
      this.cart$.next(orderData as MakaCart);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
