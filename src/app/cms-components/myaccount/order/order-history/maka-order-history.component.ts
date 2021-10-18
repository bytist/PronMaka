import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  RoutingService,
  UserOrderService,
  TranslationService,
  AuthService,
  OrderHistoryList
} from '@spartacus/core';
import { OrderHistoryComponent } from '@spartacus/storefront';
import { combineLatest } from 'rxjs';
import {
  switchMap,
  take,
  tap
} from 'rxjs/operators';

import { MakaUserOrderService } from 'src/app/shared/services/maka-user/maka-user-order.service';
import { MakaOrderHistorySearch } from '../../../../core/models/maka-order.model';

@Component({
  selector: 'app-maka-order-history',
  templateUrl: './maka-order-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaOrderHistoryComponent extends OrderHistoryComponent {

  recurringOrderFilterSelected = false;

  constructor(
    routing: RoutingService,
    userOrderService: UserOrderService,
    translation: TranslationService,
    private authService: AuthService,
    private makaUserOrderService: MakaUserOrderService
  ) {
    super(
      routing,
      userOrderService,
      translation
    );
  }

  toggleRecurringOrderFilter() {
    this.recurringOrderFilterSelected = !this.recurringOrderFilterSelected;
    const event: MakaOrderHistorySearch = {
      sortCode: this.sortType,
      currentPage: 0,
      recurrentOrders: this.recurringOrderFilterSelected
    };
    this.updateOrders(event);
  }

  changeSortCode(sortCode: string): void {
    const event: MakaOrderHistorySearch = {
      sortCode,
      currentPage: 0,
      recurrentOrders: this.recurringOrderFilterSelected
    };
    this.sortType = sortCode;
    this.updateOrders(event);
  }

  pageChange(page: number): void {
    const event: MakaOrderHistorySearch = {
      sortCode: this.sortType,
      currentPage: page,
      recurrentOrders: this.recurringOrderFilterSelected
    };
    this.updateOrders(event);
  }

  updateOrders(event: MakaOrderHistorySearch): void {
    this.orders$ = combineLatest([
      this.authService.getOccUserId()
    ]).pipe(
      take(1),
      switchMap(([userId]) => this.makaUserOrderService.fetchOrderHistory(userId, event)),
      tap((orders: OrderHistoryList) => {
        if (orders.pagination) {
          this.sortType = orders.pagination.sort;
        }
      })
    );
  }
}
