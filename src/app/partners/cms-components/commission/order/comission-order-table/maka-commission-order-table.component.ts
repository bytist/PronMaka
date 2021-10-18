import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AssociateDashboardCommissionOrders } from '../../../../../core/models/maka-associate-dashboard-commission-orders.model';

@Component({
  selector: 'app-maka-commission-order-table',
  templateUrl: './maka-commission-order-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MakaCommissionOrderTableComponent {

  @Input()
  orders: AssociateDashboardCommissionOrders;

  @Output()
  gotToPage = new EventEmitter<number>();

  pageChange(page: number) {
    this.gotToPage.emit(page);
  }
}
