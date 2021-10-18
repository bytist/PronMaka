import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';
import { OrderHistoryList } from '@spartacus/core';

import { MakaOrderHistory } from '../../../../../core/models/maka-order.model';

@Component({
  selector: 'app-maka-order-history-table',
  templateUrl: './maka-order-history-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaOrderHistoryTableComponent implements OnInit {

  @Input()
  orders: OrderHistoryList;

  @Output()
  navigateToDetail = new EventEmitter<MakaOrderHistory>();

  hasRecurrentOrders: boolean;

  ngOnInit(): void {
    this.hasRecurrentOrders = this.orders.orders.filter((order) => (order as MakaOrderHistory).recurrence).length > 0;
  }

  goToOrderDetail(orderHistory: MakaOrderHistory) {
    this.navigateToDetail.emit(orderHistory);
  }

  isRecurringOrder(orderHistory: MakaOrderHistory) {
    return orderHistory.recurrence;
  }
}
