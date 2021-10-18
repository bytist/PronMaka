import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderDetailsService } from '@spartacus/storefront';

import { MakaOrder } from '../../../../../core/models';

@Component({
  selector: 'app-maka-order-detail-shipping',
  templateUrl: './maka-order-detail-shipping.component.html'
})
export class MakaOrderDetailShippingComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  order$: Observable<MakaOrder> = this.orderDetailsService.getOrderDetails().pipe(takeUntil(this.unsubscribe$));

  constructor( private orderDetailsService: OrderDetailsService ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
